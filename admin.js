import { fields, maxFeedbackCards, mediaTypes } from './portfolio-fields.js?v=2';
import { readOriginal } from './portfolio-content.js?v=2';

const find = selector => document.querySelector(selector);
const login = find('#login');
const dashboard = find('#dashboard');
const initial = find('#initial');
const loginForm = find('#login-form');
const firstLogin = find('#first-login');
const firstLoginForm = find('#first-login-form');
const firstLoginStatus = find('#first-login-status');
const backToLogin = find('#back-to-login');
let provisionalCredentials;
const editor = find('#editor');
const editorFields = find('#editor-fields');
const save = find('#save');
const logout = find('#logout');
const loginStatus = find('#login-status');
const saveStatus = find('#save-status');
const saveFeedback = find('#save-feedback');
const saveFeedbackLabel = find('#save-feedback-label');
const feedbackFields = find('#feedback-fields');
const feedbackEmpty = find('#feedback-empty');
const addFeedback = find('#add-feedback');
const selections = new Map();
let local = false;
let revision = null;
let draft;
let dirty = false;
let busy = false;
let saveFeedbackTimer;

async function api(action, options = {}) {
  const response = await fetch('/api/portfolio?action=' + action, options);
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Não foi possível acessar o painel.');
  return body;
}

const jsonRequest = (method, value) => ({
  method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(value),
});

function notice(element, message, error = false) {
  element.textContent = message;
  element.toggleAttribute('data-error', error);
}

function showSaving() {
  clearTimeout(saveFeedbackTimer);
  saveFeedback.dataset.state = 'saving';
  saveFeedbackLabel.textContent = 'Salvando…';
  saveFeedback.showModal();
  return performance.now();
}

async function showSaved(started) {
  const remaining = 500 - (performance.now() - started);
  if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
  saveFeedback.dataset.state = 'done';
  saveFeedbackLabel.textContent = 'Concluído';
  saveFeedbackTimer = setTimeout(() => saveFeedback.close(), 2200);
}

saveFeedback.addEventListener('cancel', event => {
  if (saveFeedback.dataset.state === 'saving') event.preventDefault();
});

function setDirty(value) {
  if (dirty !== value) {
    if (value) addEventListener('beforeunload', warnUnsaved);
    else removeEventListener('beforeunload', warnUnsaved);
  }
  dirty = value;
  save.disabled = busy || !dirty;
}

function warnUnsaved(event) {
  event.preventDefault();
  event.returnValue = true;
}

function mediaField(key, title, kind, record) {
  const media = mediaTypes[kind];
  const wrapper = document.createElement('div');
  wrapper.className = 'media-field';
  const preview = document.createElement(kind === 'video' ? 'video' : 'img');
  if (kind === 'video') {
    preview.controls = true;
    preview.playsInline = true;
    preview.preload = 'none';
    if (record[key].startsWith('assets/')) {
      preview.poster = record[key].replace(/\.mp4$/, '-poster.jpg');
    }
  } else {
    preview.alt = '';
    preview.loading = 'lazy';
  }
  if (record[key]) preview.src = new URL(record[key], location.origin).href;
  else {
    wrapper.classList.add('is-empty');
    preview.hidden = true;
  }
  const label = document.createElement('label');
  label.textContent = title;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = Object.keys(media.types).join(',');
  input.required = !record[key];
  const hint = document.createElement('small');
  const original = kind === 'video' ? 'MP4' : 'JPG, PNG ou WebP';
  const hintText = `${original} · até ${media.max / 1024 ** 2} MB`;
  hint.textContent = hintText;
  label.append(input, hint);
  wrapper.append(preview, label);

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    if (!Object.hasOwn(media.types, file.type) || !file.size || file.size > media.max) {
      input.value = '';
      notice(saveStatus, `Confira o arquivo. Formatos aceitos: ${hintText}.`, true);
      return;
    }
    const previous = selections.get(input);
    if (previous) URL.revokeObjectURL(previous.previewUrl);
    const previewUrl = URL.createObjectURL(file);
    preview.removeAttribute('poster');
    preview.src = previewUrl;
    preview.hidden = false;
    wrapper.classList.remove('is-empty');
    input.required = false;
    hint.textContent = file.name;
    selections.set(input, { record, key, kind, file, previewUrl, title });
    setDirty(true);
    notice(saveStatus, 'Alterações pendentes.');
  });
  return wrapper;
}

function renderGroup(record, schema, heading) {
  const list = document.createElement('div');
  list.className = 'field-list';
  for (const [key, [title, kind, length]] of Object.entries(schema)) {
    if (Object.hasOwn(mediaTypes, kind)) {
      list.append(mediaField(key, title, kind, record));
      continue;
    }
    const label = document.createElement('label');
    label.textContent = title;
    const input = document.createElement(kind === 'textarea' ? 'textarea' : 'input');
    if (kind === 'textarea') input.rows = key === 'description' || key === 'text' ? 5 : 2;
    else input.type = kind;
    input.required = true;
    input.maxLength = length;
    input.value = record[key];
    if (kind === 'tel') {
      input.placeholder = '+55 (92) 99999-9999';
    }
    input.addEventListener('input', () => {
      record[key] = input.value;
      if (key === 'title' && heading) heading.textContent = input.value.trim() || title;
      setDirty(true);
      notice(saveStatus, 'Alterações pendentes.');
    });
    label.append(input);
    list.append(label);
  }
  return list;
}

function editorDetail(record, schema, title) {
  const detail = document.createElement('details');
  const heading = document.createElement('summary');
  heading.textContent = title;
  detail.append(heading, renderGroup(record, schema, heading));
  return detail;
}

function syncFeedbackEditor() {
  [...feedbackFields.children].forEach((detail, index) => {
    const title = `Cartão ${index + 1}`;
    detail.querySelector('summary').textContent = title;
    detail.querySelector('.remove-card').setAttribute('aria-label', `Remover cartão ${index + 1}`);
  });
  feedbackEmpty.hidden = draft.feedback.length > 0;
  addFeedback.disabled = draft.feedback.length >= maxFeedbackCards;
  addFeedback.title = addFeedback.disabled ? `Limite de ${maxFeedbackCards} cartões` : '';
}

function feedbackDetail(record) {
  const detail = editorDetail(record, fields.feedback, '');
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'outline remove-card';
  remove.textContent = 'Remover cartão';
  remove.addEventListener('click', () => {
    const nextFocus = detail.nextElementSibling?.querySelector('summary')
      ?? detail.previousElementSibling?.querySelector('summary') ?? addFeedback;
    const input = detail.querySelector('input[type=file]');
    const selection = selections.get(input);
    if (selection) URL.revokeObjectURL(selection.previewUrl);
    selections.delete(input);
    draft.feedback.splice(draft.feedback.indexOf(record), 1);
    detail.remove();
    syncFeedbackEditor();
    setDirty(true);
    notice(saveStatus, 'Cartão removido. Salve para atualizar o portfólio.');
    nextFocus.focus();
  });
  detail.querySelector('.field-list').append(remove);
  return detail;
}

addFeedback.addEventListener('click', () => {
  const record = { image: '', quote: '' };
  draft.feedback.push(record);
  const detail = feedbackDetail(record);
  detail.open = true;
  feedbackFields.append(detail);
  syncFeedbackEditor();
  setDirty(true);
  notice(saveStatus, 'Escolha a imagem e preencha a frase do novo cartão.');
  detail.querySelector('summary').focus();
});

function render() {
  for (const selection of selections.values()) URL.revokeObjectURL(selection.previewUrl);
  selections.clear();
  find('#hero-fields').replaceChildren(renderGroup(draft.hero, fields.hero));
  find('#film-fields').replaceChildren(...draft.films.map(film => editorDetail(film, fields.film, film.title)));
  find('#about-fields').replaceChildren(renderGroup(draft.about, fields.about));
  feedbackFields.replaceChildren(...draft.feedback.map(feedbackDetail));
  syncFeedbackEditor();
  find('#contact-fields').replaceChildren(renderGroup(draft.contact, fields.contact));
}

async function showDashboard(session) {
  local = session.local;
  const saved = await api('content');
  revision = saved.revision;
  if (saved.content) draft = saved.content;
  else {
    const response = await fetch('/');
    if (!response.ok) throw new Error('Não foi possível carregar o conteúdo atual do portfólio.');
    const page = new DOMParser().parseFromString(await response.text(), 'text/html');
    draft = readOriginal(page);
  }
  render();
  notice(saveStatus, '');
  setDirty(false);
  login.hidden = true;
  firstLogin.hidden = true;
  logout.hidden = false;
  dashboard.hidden = false;
}

function showLogin() {
  provisionalCredentials = undefined;
  firstLoginForm.reset();
  firstLogin.hidden = true;
  dashboard.hidden = true;
  logout.hidden = true;
  login.hidden = false;
}

loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(loginForm);
  form.set('user', form.get('user').trim());
  const credentials = Object.fromEntries(form);
  const button = loginForm.querySelector('button');
  button.disabled = true;
  notice(loginStatus, 'Entrando…');
  try {
    const session = await api('login', jsonRequest('POST', credentials));
    loginForm.reset();
    if (session.passwordChangeRequired) {
      provisionalCredentials = credentials;
      login.hidden = true;
      firstLogin.hidden = false;
      notice(loginStatus, '');
      notice(firstLoginStatus, '');
      firstLoginForm.elements.newPassword.focus();
    } else {
      await showDashboard(session);
    }
  } catch (error) {
    notice(loginStatus, error.message, true);
  } finally {
    button.disabled = false;
  }
});

backToLogin.addEventListener('click', () => {
  showLogin();
  loginForm.elements.user.focus();
});

firstLoginForm.addEventListener('submit', async event => {
  event.preventDefault();
  const fields = new FormData(firstLoginForm);
  const newPassword = fields.get('newPassword');
  if (newPassword !== fields.get('confirmPassword')) {
    notice(firstLoginStatus, 'As duas senhas precisam ser iguais.', true);
    return;
  }
  const submit = firstLoginForm.querySelector('button[type=submit]');
  submit.disabled = backToLogin.disabled = true;
  notice(firstLoginStatus, '');
  const started = showSaving();
  try {
    const session = await api('choose-password', jsonRequest('POST', { ...provisionalCredentials, newPassword }));
    provisionalCredentials = undefined;
    firstLoginForm.reset();
    await showDashboard(session);
    await showSaved(started);
  } catch (error) {
    saveFeedback.close();
    notice(firstLoginStatus, error.message, true);
  } finally {
    submit.disabled = backToLogin.disabled = false;
  }
});

logout.addEventListener('click', async () => {
  if (dirty && !confirm('Sair e descartar as alterações pendentes?')) return;
  logout.disabled = true;
  try {
    await api('logout', { method: 'POST' });
    setDirty(false);
    for (const selection of selections.values()) URL.revokeObjectURL(selection.previewUrl);
    selections.clear();
    notice(loginStatus, '');
    showLogin();
  } catch (error) {
    notice(saveStatus, error.message, true);
  } finally {
    logout.disabled = false;
  }
});

function getDuration(url, name) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const fail = () => reject(new Error(`Não foi possível ler o vídeo ${name}. Use um MP4 compatível com o navegador.`));
    const timer = setTimeout(fail, 10_000);
    video.preload = 'metadata';
    video.addEventListener('loadedmetadata', () => {
      clearTimeout(timer);
      if (!Number.isFinite(video.duration) || video.duration <= 0) {
        fail();
        return;
      }
      const seconds = Math.round(video.duration);
      const pad = value => String(value).padStart(2, '0');
      resolve(`${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`);
    }, { once: true });
    video.addEventListener('error', () => {
      clearTimeout(timer);
      fail();
    }, { once: true });
    video.src = url;
  });
}

async function uploadSelection(selection) {
  const { kind, file } = selection;
  if (local) {
    const result = await api('upload&kind=' + kind, {
      method: 'POST', headers: { 'Content-Type': file.type }, body: file,
    });
    return result.url;
  }
  const { upload } = await import('/admin-upload.js');
  const extension = mediaTypes[kind].types[file.type];
  const result = await upload(`portfolio/media/${crypto.randomUUID()}.${extension}`, file, {
    access: 'public',
    contentType: file.type,
    handleUploadUrl: '/api/portfolio?action=upload',
    clientPayload: kind,
    multipart: file.size > 10 * 1024 ** 2,
  });
  return result.url;
}

editor.addEventListener('invalid', event => {
  const detail = event.target.closest('details');
  if (detail) detail.open = true;
}, true);

editor.addEventListener('submit', async event => {
  event.preventDefault();
  if (busy || !dirty) return;
  busy = true;
  editorFields.disabled = logout.disabled = save.disabled = true;
  const started = showSaving();
  try {
    for (const selection of selections.values()) {
      const { record, key, kind, file, previewUrl } = selection;
      saveFeedbackLabel.textContent = 'Enviando arquivos…';
      const duration = kind === 'video' ? await getDuration(previewUrl, file.name) : null;
      selection.uploadedUrl ??= await uploadSelection(selection);
      record[key] = selection.uploadedUrl;
      if ('duration' in record) record.duration = duration;
    }
    saveFeedbackLabel.textContent = 'Salvando…';
    const result = await api('content', jsonRequest('PUT', { revision, content: draft }));
    revision = result.revision;
    for (const [input, selection] of selections) {
      const preview = input.closest('.media-field').querySelector('img, video');
      preview.src = selection.uploadedUrl;
      input.value = '';
      URL.revokeObjectURL(selection.previewUrl);
    }
    selections.clear();
    setDirty(false);
    notice(saveStatus, 'Alterações salvas no portfólio.');
    await showSaved(started);
  } catch (error) {
    saveFeedback.close();
    notice(saveStatus, error.message, true);
  } finally {
    busy = false;
    editorFields.disabled = logout.disabled = false;
    save.disabled = !dirty;
  }
});

try {
  const session = await api('session');
  if (session.signedIn) await showDashboard(session);
  else showLogin();
  initial.hidden = true;
} catch (error) {
  initial.textContent = error.message;
  initial.className = 'notice';
  initial.dataset.error = '';
}
