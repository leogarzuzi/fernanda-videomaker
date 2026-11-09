import { portfolioApi } from '../portfolio-api.mjs';

export default {
  fetch(request) {
    return portfolioApi(request, { client: request.headers.get('x-vercel-forwarded-for') ?? 'unknown' });
  },
};
