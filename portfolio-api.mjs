import { createHmac, createHash, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';
import { BlobPreconditionFailedError, get, put } from '@vercel/blob';
import { handleUpload } from '@vercel/blob/client';
import { fields, maxFeedbackCards, mediaTypes } from './portfolio-fields.js';

export const localData = fileURLToPath(new URL('./.portfolio-data/', import.meta.url));
const contentFile = 'portfolio/content.json';
const localContent = new URL('./.portfolio-data/content.json', import.meta.url);
const localEnv = new URL('./.env', import.meta.url);
const sessionSeconds = 8 * 60 * 60;
const cookieName = 'tahara_admin';
const attempts = new Map();
const loginWindow = 15 * 60_000;
let pendingLocalWrite = Promise.resolve();

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const conflict = () => new RequestError(409, 'O site foi atualizado em outra sessão. Recarregue o painel antes de salvar.');
const invalid = () => new RequestError(400, 'Confira os textos, arquivos e contatos antes de salvar.');
const digest = value => createHash('sha256').update(value).digest('hex');
const same = (a, b) => timingSafeEqual(Buffer.from(digest(a)), Buffer.from(digest(b)));
const json = (value, status = 200, headers = {}) => Response.json(value, {
  status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
});

function sessionSignature(expiration, user, password) {
  return createHmac('sha256', password).update(`tahara-admin:${user}:${expiration}`).digest('base64url');
}

function sessionCookie(value, maxAge, secure) {
  return `${cookieName}=${value}; Path=/api/portfolio; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? '; Secure' : ''}`;
}

function hasSession(request, user, password) {
  const value = request.headers.get('cookie')?.match(/(?:^|;\s*)tahara_admin=(\d+\.[\w-]+)(?:;|$)/)?.[1];
  if (!value || !user || !password) return false;
  const [expiration, signature] = value.split('.');
  return Number(expiration) > Date.now() && same(signature, sessionSignature(expiration, user, password));
}

export async function readLocalEnv() {
  try {
    return parseEnv(await readFile(localEnv, 'utf8'));
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    return {};
  }
}

async function readJson(request) {
  try {
    if (!request.headers.get('content-type')?.startsWith('application/json')) throw invalid();
    const reader = request.body.getReader();
    const chunks = [];
    let size = 0;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 128 * 1024) {
        await reader.cancel();
        throw invalid();
      }
      chunks.push(value);
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    throw invalid();
  }
}

const uploadedName = /^[a-f0-9-]{36}\.(mp4|jpg|png|webp)$/;

function validateMedia(value, kind, local) {
  const { types } = mediaTypes[kind];
  if (kind === 'video' && /^assets\/(?:hero-film-enhanced|filme-0[1-4])\.mp4$/.test(value)) return value;
  if (kind === 'image' && /^assets\/feedbacks\/mensagem-0[1-6]\.png$/.test(value)) return value;
  if (local && value.startsWith('/portfolio-media/') && uploadedName.test(value.slice(17))
    && Object.values(types).includes(value.split('.').at(-1))) return value;
  if (!local && /^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/portfolio\/media\/[a-f0-9-]{36}\.(mp4|jpg|png|webp)$/.test(value)
    && Object.values(types).includes(value.split('.').at(-1))) return value;
  throw invalid();
}

function validateGroup(group, schema, local) {
  if (!group || typeof group !== 'object') throw invalid();
  return Object.fromEntries(Object.entries(schema).map(([key, [, kind, limit]]) => {
    if (typeof group[key] !== 'string' || !group[key].trim() || group[key].length > (limit || 250)) throw invalid();
    const value = group[key].trim();
    return [key, Object.hasOwn(mediaTypes, kind) ? validateMedia(value, kind, local) : value];
  }));
}

function validateContent(data, local) {
  if (!data || data.films?.length !== 4 || !Array.isArray(data.films)
    || !Array.isArray(data.feedback) || data.feedback.length > maxFeedbackCards) throw invalid();
  const contact = validateGroup(data.contact, fields.contact, local);
  const whatsapp = contact.whatsapp.replace(/[\s().-]/g, '');
  if (!/^https:\/\/(?:www\.)?instagram\.com\/[a-z0-9_.]+\/?$/i.test(contact.instagram)
    || !/^\+[1-9]\d{7,14}$/.test(whatsapp)
    || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(contact.email)) throw invalid();
  return {
    hero: validateGroup(data.hero, fields.hero, local),
    films: data.films.map(film => {
      const content = validateGroup(film, fields.film, local);
      if (typeof film.duration !== 'string' || !/^\d{2,4}:[0-5]\d$/.test(film.duration)) throw invalid();
      return { ...content, duration: film.duration };
    }),
    about: validateGroup(data.about, fields.about, local),
    feedback: data.feedback.map(card => validateGroup(card, fields.feedback, local)),
    contact: { ...contact, whatsapp },
  };
}

async function readContent(local) {
  if (local) {
    try {
      const text = await readFile(localContent, 'utf8');
      return { revision: digest(text), content: JSON.parse(text) };
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      return { revision: null, content: null };
    }
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return { revision: null, content: null };
  const result = await get(contentFile, { access: 'public', useCache: false });
  if (!result) return { revision: null, content: null };
  // Blob reads can return a weak ETag for the same revision returned by a write.
  const revision = result.blob.etag.replace(/^W\//, '');
  return { revision, content: await new Response(result.stream).json() };
}

async function saveContent(local, revision, content) {
  const text = JSON.stringify(content);
  if (local) {
    const write = pendingLocalWrite.then(async () => {
      if ((await readContent(true)).revision !== revision) throw conflict();
      const temp = new URL(`./.portfolio-data/${randomUUID()}.tmp`, import.meta.url);
      await mkdir(localData, { recursive: true });
      try {
        await writeFile(temp, text, { flag: 'wx' });
        await rename(temp, localContent);
      } finally {
        await rm(temp, { force: true });
      }
      return digest(text);
    });
    pendingLocalWrite = write.catch(() => {});
    return write;
  }

  if ((await readContent(false)).revision !== revision) throw conflict();
  try {
    const blob = await put(contentFile, text, {
      access: 'public', contentType: 'application/json', cacheControlMaxAge: 60,
      allowOverwrite: revision !== null, ifMatch: revision ?? undefined,
    });
    return blob.etag;
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError || (await readContent(false)).revision !== revision) throw conflict();
    throw error;
  }
}

async function localUpload(request, kind) {
  const media = mediaTypes[kind];
  const mime = request.headers.get('content-type');
  const ext = media && Object.hasOwn(media.types, mime) ? media.types[mime] : null;
  if (!ext || !request.body) throw invalid();
  if (Number(request.headers.get('content-length')) > media.max) throw new RequestError(413, 'Arquivo maior que o limite.');
  const name = `${randomUUID()}.${ext}`;
  const dir = new URL('./.portfolio-data/media/', import.meta.url);
  const file = new URL(name, dir);
  await mkdir(dir, { recursive: true });
  let size = 0;
  const cap = new Transform({
    transform(chunk, encoding, callback) {
      size += chunk.length;
      if (size > media.max) callback(new RequestError(413, 'Arquivo maior que o limite.'));
      else callback(null, chunk);
    },
  });
  try {
    await pipeline(Readable.fromWeb(request.body), cap, createWriteStream(file, { flags: 'wx' }));
    if (!size) throw invalid();
  } catch (error) {
    await rm(file, { force: true });
    throw error;
  }
  return json({ url: `/portfolio-media/${name}` });
}

function rateLimit(client) {
  const now = Date.now();
  for (const [key, entry] of attempts) {
    if (entry.until <= now) attempts.delete(key);
  }
  const entry = attempts.get(client) ?? { count: 0, until: now + loginWindow };
  if (entry.count >= 8 || attempts.size >= 4096) {
    throw new RequestError(429, 'Muitas tentativas. Aguarde alguns minutos e tente novamente.');
  }
  entry.count += 1;
  attempts.set(client, entry);
}

export async function portfolioApi(request, { local = false, client = 'local' } = {}) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || 'content';
    const method = request.method;
    if (method === 'GET' && action === 'content') return json(await readContent(local));
    const settings = local ? await readLocalEnv() : {};
    const user = settings.ADMIN_USER ?? process.env.ADMIN_USER;
    const password = settings.ADMIN_PASSWORD ?? process.env.ADMIN_PASSWORD;
    if (!user || !password || password.length < 16) {
      throw new RequestError(503, 'Configure ADMIN_USER e uma ADMIN_PASSWORD com pelo menos 16 caracteres.');
    }
    if (!local && !process.env.BLOB_READ_WRITE_TOKEN) throw new RequestError(503, 'Conecte o armazenamento Vercel Blob ao projeto.');
    if (method === 'GET' && action === 'session') return json({ signedIn: hasSession(request, user, password), local });

    // The Blob completion webhook authenticates itself inside handleUpload.
    if (!local && method === 'POST' && action === 'upload') {
      const body = await readJson(request);
      if (body?.type === 'blob.generate-client-token') {
        if (request.headers.get('origin') !== url.origin || !hasSession(request, user, password)) {
          throw new RequestError(401, 'Entre no painel para enviar arquivos.');
        }
      } else if (body?.type !== 'blob.upload-completed') throw invalid();
      const result = await handleUpload({
        request, body,
        onBeforeGenerateToken: async (pathname, payload) => {
          if (!Object.hasOwn(mediaTypes, payload)) throw invalid();
          const media = mediaTypes[payload];
          const name = pathname.replace(/^portfolio\/media\//, '');
          if (!pathname.startsWith('portfolio/media/') || !uploadedName.test(name)
            || !Object.values(media.types).includes(name.split('.').at(-1))) throw invalid();
          return {
            allowedContentTypes: Object.keys(media.types), maximumSizeInBytes: media.max,
            validUntil: Date.now() + 15 * 60_000, addRandomSuffix: false, allowOverwrite: false,
          };
        },
      });
      return json(result);
    }

    if (method !== 'POST' && method !== 'PUT') throw new RequestError(405, 'Método indisponível.');
    if (request.headers.get('origin') !== url.origin) throw new RequestError(403, 'Origem inválida.');
    if (method === 'POST' && action === 'login') {
      rateLimit(client);
      const credentials = await readJson(request);
      const validUser = typeof credentials?.user === 'string' && same(credentials.user, user);
      const validPassword = typeof credentials?.password === 'string' && same(credentials.password, password);
      if (!validUser || !validPassword) throw new RequestError(401, 'E-mail ou senha incorretos.');
      attempts.delete(client);
      const expiration = Date.now() + sessionSeconds * 1000;
      const value = `${expiration}.${sessionSignature(expiration, user, password)}`;
      return json({ signedIn: true, local }, 200, { 'Set-Cookie': sessionCookie(value, sessionSeconds, !local) });
    }
    if (method === 'POST' && action === 'logout') {
      return json({ signedIn: false }, 200, { 'Set-Cookie': sessionCookie('', 0, !local) });
    }
    if (!hasSession(request, user, password)) throw new RequestError(401, 'Sua sessão expirou. Entre novamente.');
    if (method === 'PUT' && action === 'content') {
      const data = await readJson(request);
      if (!data || (data.revision !== null && (typeof data.revision !== 'string' || data.revision.length > 200))) throw invalid();
      const content = validateContent(data.content, local);
      const revision = await saveContent(local, data.revision, content);
      return json({ revision, content });
    }
    if (local && method === 'POST' && action === 'upload') {
      const kind = url.searchParams.get('kind');
      if (!Object.hasOwn(mediaTypes, kind)) throw invalid();
      return await localUpload(request, kind);
    }
    throw new RequestError(404, 'Rota indisponível.');
  } catch (error) {
    if (error instanceof RequestError) return json({ error: error.message }, error.status);
    console.error('Portfolio API:', error.name);
    return json({ error: 'Não foi possível concluir a operação. Tente novamente.' }, 500);
  }
}
