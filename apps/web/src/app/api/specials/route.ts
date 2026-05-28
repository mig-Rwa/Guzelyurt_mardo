import { ok } from '@/lib/server/api';
import { dailySpecials } from '@shared';

export async function GET() {
  // Filter only active specials
  const activeSpecials = dailySpecials.filter(special => special.active);

  return ok(activeSpecials);
}
