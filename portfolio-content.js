const filmCards = (root) => [...root.querySelectorAll('.film-card')];
const lines = (element) => [...element.childNodes].map(node =>
  node.nodeName === 'BR' ? '\n' : node.textContent
).join('');
const paragraphs = (elements) => [...elements].map(element => element.textContent).join('\n\n');

export function readOriginal(root) {
  const about = root.querySelector('.about-bio');
  return {
    hero: { video: root.querySelector('#hero-video source:last-child').getAttribute('src') },
    films: filmCards(root).map(card => ({
      video: card.querySelector('.film-preview source').getAttribute('src'),
      duration: card.querySelector('.film-topline span:last-child').textContent,
      theme: card.querySelector('.film-story .eyebrow').textContent,
      title: card.querySelector('.film-story h3').textContent,
      summary: card.querySelector('.film-meta p').textContent,
      description: paragraphs(card.querySelectorAll('.film-story p')),
    })),
    about: {
      title: lines(about.querySelector('h3')),
      text: paragraphs(about.querySelectorAll('.about-text p:not(.about-signature)')),
      signature: lines(about.querySelector('.about-signature')),
      cta: root.querySelector('.about-endcap .underlined').textContent,
    },
    feedback: [...root.querySelectorAll('.feedback-group:first-child .feedback-card')].map(card => ({
      image: card.querySelector('img').getAttribute('src'),
      quote: lines(card.querySelector('blockquote')).replace(/^“|”$/g, ''),
    })),
    contact: {
      instagram: root.querySelector('.contact-socials a').getAttribute('href'),
      whatsapp: root.querySelector('#copy-phone').dataset.phone,
      email: root.querySelector('#copy-email').dataset.email,
    },
  };
}

function multiline(element, text) {
  const nodes = text.split('\n').flatMap((line, i) =>
    i === 0 ? [line] : [document.createElement('br'), line]
  );
  element.replaceChildren(...nodes);
}

function changeVideo(video, src) {
  if (src === video.querySelector('source:last-child').getAttribute('src')) return;
  video.removeAttribute('poster');
  video.src = src;
  video.load();
}

function replaceParagraphs(container, text, before = null) {
  for (const paragraph of container.querySelectorAll(':scope > p')) {
    if (paragraph !== before) paragraph.remove();
  }
  for (const line of text.split(/\n\s*\n/)) {
    const paragraph = document.createElement('p');
    multiline(paragraph, line);
    container.insertBefore(paragraph, before);
  }
}

export function applyContent(content) {
  changeVideo(document.querySelector('#hero-video'), content.hero.video);
  filmCards(document).forEach((card, i) => {
    const film = content.films[i];
    const story = card.querySelector('.film-story');
    changeVideo(card.querySelector('video'), film.video);
    for (const heading of card.querySelectorAll('h3')) heading.textContent = film.title;
    story.querySelector('.eyebrow').textContent = film.theme;
    card.querySelector('.film-topline span').textContent = film.theme;
    card.querySelector('.film-topline span:last-child').textContent = film.duration;
    card.querySelector('.film-meta p').textContent = film.summary;
    card.querySelector('.film-open').setAttribute('aria-label', `Assistir ao filme ${film.title}`);
    replaceParagraphs(story, film.description);
  });

  const about = document.querySelector('.about-bio');
  const heading = about.querySelector('h3');
  if (lines(heading) !== content.about.title) {
    const words = content.about.title.match(/^([\s\S]*\s)(\S+)$/);
    multiline(heading, words ? words[1] : content.about.title);
    if (words) {
      const accent = document.createElement('em');
      accent.textContent = words[2];
      heading.append(accent);
    }
  }
  const signature = about.querySelector('.about-signature');
  multiline(signature, content.about.signature);
  replaceParagraphs(about.querySelector('.about-text'), content.about.text, signature);
  document.querySelector('.about-endcap .underlined').textContent = content.about.cta;

  const feedbacks = document.querySelector('#feedbacks');
  const hasFeedbacks = content.feedback.length > 0;
  feedbacks.hidden = !hasFeedbacks;
  document.querySelector('.menu-link[href="#feedbacks"]').hidden = !hasFeedbacks;
  const groups = [...feedbacks.querySelectorAll('.feedback-group')];
  const templates = [...groups[0].children];
  for (const [groupIndex, group] of groups.entries()) {
    const cards = content.feedback.map(({ image, quote }, i) => {
      const card = templates[i % templates.length].cloneNode(true);
      const button = card.querySelector('button');
      button.dataset.message = image;
      button.setAttribute('aria-label', `Ver mensagem original: ${quote.replaceAll('\n', ' ')}`);
      if (groupIndex > 0) button.tabIndex = -1;
      const photo = button.querySelector('img');
      photo.src = image;
      photo.draggable = false;
      multiline(card.querySelector('blockquote'), `“${quote}”`);
      return card;
    });
    group.replaceChildren(...cards);
  }
  applyContact(content.contact);
}

function applyContact({ instagram, whatsapp, email }) {
  for (const link of document.querySelectorAll('a[href^="https://www.instagram.com/"]')) {
    link.href = instagram;
    if (link.hasAttribute('aria-label')) link.setAttribute('aria-label', 'Instagram');
  }
  for (const link of document.querySelectorAll('a[href^="https://wa.me/"]')) {
    const url = new URL(link.href);
    url.pathname = '/' + whatsapp.slice(1);
    link.href = url.href;
  }
  document.querySelector('.menu-social a[href^="mailto:"]').href = 'mailto:' + email.split('@').map(encodeURIComponent).join('@');
  const phone = document.querySelector('#copy-phone');
  if (phone.dataset.phone !== whatsapp) {
    const brazil = whatsapp.match(/^\+55(\d{2})(\d{4,5})(\d{4})$/);
    phone.dataset.phone = whatsapp;
    phone.querySelector('span').textContent = brazil ? `+55 (${brazil[1]}) ${brazil[2]}-${brazil[3]}` : whatsapp;
    phone.setAttribute('aria-label', `Copiar telefone ${whatsapp}`);
  }
  const emailButton = document.querySelector('#copy-email');
  if (emailButton.dataset.email === email) return;
  emailButton.dataset.email = email;
  emailButton.setAttribute('aria-label', `Copiar e-mail ${email}`);
  emailButton.querySelector('.email-copy-label').replaceChildren(...[...email].map((character, i) => {
    const mask = document.createElement('span');
    mask.className = 'email-letter-mask';
    const letter = document.createElement('span');
    letter.className = 'email-letter';
    letter.dataset.letter = character;
    letter.style.setProperty('--letter', i);
    letter.textContent = character;
    mask.append(letter);
    return mask;
  }));
}
