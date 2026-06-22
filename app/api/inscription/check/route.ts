import { NextResponse } from 'next/server';
import { isLicenseValid } from '@/lib/licenses';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, licenseNumber } = body;

    if (!email || !licenseNumber) {
      return NextResponse.json(
        { error: 'Email et numéro de licence requis' },
        { status: 400 }
      );
    }

    // Check if license is in the valid list
    if (!isLicenseValid(licenseNumber)) {
      return NextResponse.json(
        { error: 'Numéro de licence invalide' },
        { status: 400 }
      );
    }

    // In production, you would check a database for already used licenses
    // For now, just allow the license if it's in the valid list
    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('Check license error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la vérification' },
      { status: 500 }
    );
  }
}