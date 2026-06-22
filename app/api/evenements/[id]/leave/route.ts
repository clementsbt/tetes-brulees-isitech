import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifyParticipantLeft } from '@/lib/notifications';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: eventId } = await params;
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const userEmail = user.email;

    // Get event with participations
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        createdBy: {
          select: { email: true, name: true },
        },
        participations: {
          include: {
            user: {
              select: { email: true, name: true },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 });
    }

    // Check if user is participant
    const isParticipant = event.participations.some(
      (p: any) => p.user && p.user.email === userEmail
    );

    if (!isParticipant) {
      return NextResponse.json({ error: 'Vous n\'êtes pas inscrit à cet événement' }, { status: 400 });
    }

    // Delete participation
    await db.participation.deleteMany({
      where: { eventId: eventId },
    });

    // Notifier le créateur et les autres participants
    const participantName = user.name || 'Un membre';
    await notifyParticipantLeft(
      eventId,
      event.title,
      event.startDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      participantName
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error leaving evenement:', error);
    const message = error instanceof Error ? error.message : 'Inconnue';
    return NextResponse.json({ error: 'Erreur serveur: ' + message }, { status: 500 });
  }
}