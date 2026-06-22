import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifyNewParticipantToEvent } from '@/lib/notifications';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    const body = await request.json();
    const { evenementId } = body;

    if (!evenementId) {
      return NextResponse.json({ error: 'ID événement requis' }, { status: 400 });
    }

    // Check if event exists
    const event = await db.event.findUnique({
      where: { id: evenementId },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
        participations: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 });
    }

    // Check if already joined
    const existing = await db.participation.findUnique({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: evenementId,
        },
      },
    });

    let isNewParticipant = false;
    if (!existing) {
      await db.participation.create({
        data: {
          userId: user.id,
          eventId: evenementId,
        },
      });
      isNewParticipant = true;
    }

    // Notifier le créateur et tous les participants
    if (isNewParticipant) {
      const participantName = user.name || 'Un membre';
      await notifyNewParticipantToEvent(
        evenementId,
        event.title,
        event.startDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
        participantName
      );
    }

    // Return updated event
    const updatedEvent = await db.event.findUnique({
      where: { id: evenementId },
      include: {
        participations: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      evenement: {
        id: updatedEvent.id,
        nom: updatedEvent.title,
        date: updatedEvent.startDate.toISOString(),
        participants: updatedEvent.participations.map((p: any) => ({
          email: p.user.email,
          name: p.user.name,
        })),
      },
    });
  } catch (error) {
    console.error('Join error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}