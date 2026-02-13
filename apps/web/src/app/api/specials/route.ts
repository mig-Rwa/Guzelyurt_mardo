import { NextResponse } from 'next/server';
import { dailySpecials } from '@shared';

export async function GET() {
  // Filter only active specials
  const activeSpecials = dailySpecials.filter(special => special.active);
  
  return NextResponse.json({
    success: true,
    data: activeSpecials,
  });
}
