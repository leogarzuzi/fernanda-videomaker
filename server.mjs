import http from 'node:http';
import { stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { localData, portfolioApi, readLocalEnv } from './portfolio-api.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || (await readLocalEnv()).PORT || 4173);
const pages = new Set([
  'index.html', 'style.css', 'script.js', 'admin.html', 'admin.css', 'admin.js',
  'portfolio-fields.js', 'portfolio-content.js',
]);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.woff2': 'font/woff2',
};

function staticFile(pathname) {
  if (pathname === '/') return path.join(root, 'index.html');
  if (pathname === '/admin' || pathname === '/admin/') return path.join(root, 'admin.html');
  if (/^\/portfolio-media\/[a-f0-9-]{36}\.(mp4|jpg|png|webp)$/.test(pathname)) {
    return path.join(localData, 'media', path.basename(pathname));
  }
  const relative = pathname.slice(1);
  if (pages.has(relative)) return path.join(root, relative);
  const assets = path.join(root, 'assets') + path.sep;
  const filename = path.resolve(root, relative);
  return filename.startsWith(assets) ? filename : null;
}

async function sendStatic(req, res, filename) {
  if (!filename) throw new Error('Not found');
  const info = await stat(filename);
  if (!info.isFile()) throw new Error('Not found');
  const headers = {
    'Content-Type': types[path.extname(filename)] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
    'Accept-Ranges': 'bytes',
    'X-Content-Type-Options': 'nosniff',
  };
  if (filename === path.join(root, 'admin.html')) {
    headers['X-Frame-Options'] = 'DENY';
    headers['X-Robots-Tag'] = 'noindex, nofollow';
  }
  let start = 0;
  let end = info.size - 1;
  const range = req.headers.range;
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match && (match[1] || match[2])) {
      if (!match[1]) start = Math.max(0, info.size - Number(match[2]));
      else {
        start = Number(match[1]);
        if (match[2]) end = Math.min(end, Number(match[2]));
      }
    }
    if (!match || (!match[1] && !match[2]) || start > end || start >= info.size) {
      res.writeHead(416, { 'Content-Range': `bytes */${info.size}` }).end();
      return;
    }
    headers['Content-Range'] = `bytes ${start}-${end}/${info.size}`;
  }
  headers['Content-Length'] = end - start + 1;
  res.writeHead(range ? 206 : 200, headers);
  if (req.method === 'HEAD' || !info.size) {
    res.end();
    return;
  }
  const stream = createReadStream(filename, { start, end });
  stream.on('error', () => res.destroy());
  res.on('close', () => stream.destroy());
  stream.pipe(res);
}

http.createServer(async (req, res) => {
  try {
    const host = req.headers.host ?? '';
    if (!/^(?:localhost|127\.0\.0\.1)(?::\d+)?$/i.test(host)) {
      res.writeHead(403).end();
      return;
    }
    const url = new URL(req.url, 'http://' + host);
    if (url.pathname === '/api/portfolio') {
      const options = { method: req.method, headers: req.headers };
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        options.body = Readable.toWeb(req);
        options.duplex = 'half';
      }
      const result = await portfolioApi(new Request(url, options), { local: true });
      res.writeHead(result.status, Object.fromEntries(result.headers));
      Readable.fromWeb(result.body).pipe(res);
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end();
      return;
    }
    await sendStatic(req, res, staticFile(decodeURIComponent(url.pathname)));
  } catch {
    res.writeHead(404).end('Arquivo não encontrado');
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://localhost:${port}`));
