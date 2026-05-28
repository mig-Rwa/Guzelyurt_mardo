import { ok } from '@/lib/server/api';

export async function GET() {
  return ok({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'mardo-cafe-api',
    routes: [
      '/api/health',
      '/api/me',
      '/api/menu',
      '/api/specials',
      '/api/orders',
      '/api/reservations',
      '/api/photos',
      '/api/newsletter',
    ],
  });
}
