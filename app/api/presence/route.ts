import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'change-me-in-production'
);

export async function GET() {
  try {
    // Fetch all presences from database
    const dbPresences = await prisma.presence.findMany({
      where: {
        location: 'Valfréjus'
      },
      include: {
        user: {
          select: { email: true, name: true, phone: true }
        }
      }
    });

    // Group by date
    const presencesByDate: { [date: string]: { email: string; name: string; phone?: string }[] } = {};
    
    for (const p of dbPresences) {
      // Format date in local timezone to match frontend formatDate
      const dateObj = new Date(p.date);
      const dateKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
      
      if (!presencesByDate[dateKey]) {
        presencesByDate[dateKey] = [];
      }
      if (p.user) {
        presencesByDate[dateKey].push({
          email: p.user.email,
          name: p.user.name || 'Inconnu',
          phone: p.user.phone || undefined
        });
      }
    }

    return NextResponse.json(presencesByDate);
  } catch (error) {
    console.error('Presence GET error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let userId: string | null = null;
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Non connecté' }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const { email } = payload as { email: string; name: string };

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    userId = dbUser.id;

    const body = await request.json();
    const { date, present } = body;

    if (!date) {
      return NextResponse.json({ error: 'Date requise' }, { status: 400 });
    }

    // Parse date as local (yyyy-mm-dd from frontend means local date)
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (present) {
      // Add or update presence
      await prisma.presence.upsert({
        where: {
          userId_date: {
            userId: dbUser.id,
            date: dateObj
          }
        },
        update: { location: 'Valfréjus' },
        create: {
          userId: dbUser.id,
          date: dateObj,
          location: 'Valfréjus'
        }
      });
    } else {
      // Remove presence
      await prisma.presence.deleteMany({
        where: {
          userId: dbUser.id,
          date: dateObj
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Presence POST error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}