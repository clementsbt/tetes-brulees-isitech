import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Read from cookie like other auth endpoints
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ notifyOnNewEvent: false });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ notifyOnNewEvent: false });
    }

    const user = await db.user.findUnique({
      where: { id: payload.userId },
      select: { notifyOnNewEvent: true },
    });

    return NextResponse.json({ notifyOnNewEvent: user?.notifyOnNewEvent ?? false });
  } catch (error) {
    console.error('Preferences GET error:', error);
    return NextResponse.json({ notifyOnNewEvent: false });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 });
    }

    const body = await request.json();
    const { notifyOnNewEvent } = body;

    await db.user.update({
      where: { id: payload.userId },
      data: { notifyOnNewEvent: Boolean(notifyOnNewEvent) },
    });

    return NextResponse.json({ success: true, notifyOnNewEvent });
  } catch (error) {
    console.error('Preferences PUT error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}