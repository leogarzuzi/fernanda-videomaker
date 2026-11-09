export const mediaTypes = {
  video: { types: { 'video/mp4': 'mp4' }, max: 150 * 1024 ** 2 },
  image: { types: { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }, max: 8 * 1024 ** 2 },
};

export const maxFeedbackCards = 24;

export const fields = {
  hero: { video: ['Vídeo de abertura', 'video'] },
  film: {
    video: ['Vídeo', 'video'],
    theme: ['Tema', 'text', 80],
    title: ['Título', 'text', 110],
    summary: ['Frase curta no celular', 'text', 180],
    description: ['Texto do filme', 'textarea', 2400],
  },
  about: {
    title: ['Título da apresentação', 'textarea', 120],
    text: ['Biografia', 'textarea', 4000],
    signature: ['Frase de assinatura', 'textarea', 320],
    cta: ['Texto do convite', 'text', 120],
  },
  feedback: {
    image: ['Foto ou print', 'image'],
    quote: ['Frase abaixo da imagem', 'textarea', 360],
  },
  contact: {
    instagram: ['Link do Instagram', 'url', 220],
    whatsapp: ['WhatsApp com código do país', 'tel', 30],
    email: ['E-mail', 'email', 120],
  },
};
