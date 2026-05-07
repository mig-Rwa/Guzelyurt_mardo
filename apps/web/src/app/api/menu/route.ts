import { NextRequest } from 'next/server';
import { MenuItemCreateSchema } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/server/mockDb';
import { fail, forbidden, getRequestContext, ok } from '@/lib/server/api';
import { menuItems } from '@shared';

// Initialize menu items in db on first load (if empty)
function initializeMenu() {
  if (db.menuItems.length === 0) {
    db.menuItems = menuItems.map(item => ({
      ...item,
      stock: item.stock || 50,
    }));
  }
}

export async function GET(request: NextRequest) {
  initializeMenu();

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  let items = [...db.menuItems];

  if (category && category !== 'all') {
    items = items.filter(item => item.category === category);
  }

  return ok(items, { meta: { total: items.length } });
}

export async function POST(request: NextRequest) {
  const ctx = getRequestContext(request);

  // Only admin can create menu items
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    initializeMenu();
    const body = await request.json();

    // Validate input
    const validationResult = MenuItemCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return fail('Invalid menu item data', 400);
    }

    const data = validationResult.data;

    const newItem = {
      id: uuidv4(),
      ...data,
      stock: data.stock || 50,
    };

    db.menuItems.push(newItem);

    return ok(newItem, { status: 201 });
  } catch (error) {
    console.error('Menu creation error:', error);
    return fail('Failed to create menu item', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const ctx = getRequestContext(request);

  // Only admin can update menu items
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    initializeMenu();
    const body = await request.json();
    const itemId = body?.id as string | undefined;

    if (!itemId) {
      return fail('Menu item id is required', 400);
    }

    const existingIndex = db.menuItems.findIndex(item => item.id === itemId);
    if (existingIndex === -1) {
      return fail('Menu item not found', 404);
    }

    // Update fields that can be changed
    const updatable = ['name', 'description', 'price', 'category', 'image', 'available', 'stock'];
    const updateData = Object.keys(body).reduce((acc, key) => {
      if (updatable.includes(key)) {
        acc[key] = body[key];
      }
      return acc;
    }, {} as any);

    db.menuItems[existingIndex] = {
      ...db.menuItems[existingIndex],
      ...updateData,
    };

    return ok(db.menuItems[existingIndex]);
  } catch (error) {
    console.error('Menu update error:', error);
    return fail('Failed to update menu item', 500);
  }
}

export async function DELETE(request: NextRequest) {
  const ctx = getRequestContext(request);

  // Only admin can delete menu items
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    initializeMenu();
    const body = await request.json();
    const itemId = body?.id as string | undefined;

    if (!itemId) {
      return fail('Menu item id is required', 400);
    }

    const existingIndex = db.menuItems.findIndex(item => item.id === itemId);
    if (existingIndex === -1) {
      return fail('Menu item not found', 404);
    }

    const deleted = db.menuItems.splice(existingIndex, 1)[0];

    return ok(deleted);
  } catch (error) {
    console.error('Menu deletion error:', error);
    return fail('Failed to delete menu item', 500);
  }
}

