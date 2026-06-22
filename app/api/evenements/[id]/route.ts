import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    // Check if event exists and user is creator
    const event = await db.event.findUnique({
      where: { id },
      select: { createdById: true },
    });

    if (!event) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 });
    }

    if (event.createdById !== user.id) {
      return NextResponse.json({ error: 'Only creator can delete' }, { status: 403 });
    }

    // Delete participations first, then event
    await db.participation.deleteMany({
      where: { eventId: id },
    });

    await db.event.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}