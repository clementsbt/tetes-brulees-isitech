import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://bulletinv3.lumiplan.pro/bulletin.php?station=valfrejus&lang=fr&isSoir=false', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TetesBrulees/1.0)',
      },
    });
    
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
    
    const html = await res.text();
    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}