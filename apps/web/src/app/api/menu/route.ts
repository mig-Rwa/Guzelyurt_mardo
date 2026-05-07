import { ok } from '@/lib/server/api';
import { menuItems } from '@shared';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  let items = menuItems;
  
  if (category && category !== 'all') {
    items = menuItems.filter(item => item.category === category);
  }
  
  return ok(items, { meta: { total: items.length } });
}
