import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken, getUserFromToken } from '@/lib/auth';
import { db } from '@/lib/db';
import { notifyNewEvent } from '@/lib/notifications';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    const where: any = {};
    
    // Filter by month/year if provided
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 1);
      where.startDate = {
        gte: startDate,
        lt: endDate,
      };
    }

    const events = await db.event.findMany({
      where,
      include: {
        createdBy: {
          select: { name: true, email: true, phone: true },
        },
        participations: {
          include: {
            user: {
              select: { name: true, email: true, phone: true },
            },
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    // Format for frontend
    const formatted = events.map((e: any) => ({
      id: e.id,
      nom: e.title,
      date: e.startDate.toISOString(),
      time: e.startDate.toTimeString().slice(0,5),
      location: e.location,
      createurEmail: e.createdBy.email,
      createurNom: e.createdBy.name,
      createurPhone: e.createdBy.phone,
      createurId: e.createdById,
      participants: e.participations.map((p: any) => ({
        email: p.user.email,
        name: p.user.name,
        phone: p.user.phone,
      })),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Events GET error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

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
    const { nom, date, time, location } = body;

    if (!nom || !date) {
      return NextResponse.json({ error: 'Nom et date requis' }, { status: 400 });
    }

    if (!location) {
      return NextResponse.json({ error: 'Lieu requis' }, { status: 400 });
    }

    // Create event with creator as first participant
    const startDate = new Date(date);
    if (time) {
      const [hours, minutes] = time.split(':');
      startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    const event = await db.event.create({
      data: {
        title: nom,
        location,
        startDate,
        endDate: startDate,
        createdById: user.id,
        participations: {
          create: {
            userId: user.id,
          },
        },
      },
      include: {
        createdBy: {
          select: { name: true, email: true },
        },
      },
    });

    // Notifier les membres qui ont coché la case
    await notifyNewEvent(
      event.title,
      event.startDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
      event.location
    );

    return NextResponse.json({
      success: true,
      evenement: {
        id: event.id,
        nom: event.title,
        date: event.startDate.toISOString(),
        createurEmail: event.createdBy.email,
        createurNom: event.createdBy.name,
        participants: [{ email: event.createdBy.email, name: event.createdBy.name }],
      },
    });
  } catch (error) {
    console.error('Event POST error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}