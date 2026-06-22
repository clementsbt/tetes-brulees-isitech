import { NextResponse } from 'next/server';
import { prisma as getPrisma } from '@/lib/prisma';

// Test endpoint to add license directly
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { licenseNumber } = body;

    if (!licenseNumber) {
      return NextResponse.json({ error: 'License required' }, { status: 400 });
    }

    const prisma = await getPrisma();
    
    // Just create it directly
    const result = await prisma.usedLicense.create({
      data: { licenseNumber },
    });

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}