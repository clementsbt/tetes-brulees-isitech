import { NextResponse } from 'next/server';
import { isLicenseValid } from '@/lib/licenses';
import { registerUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, licenseNumber, password, name, phone, firstName, lastName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Phone required
    if (!phone) {
      return NextResponse.json(
        { error: 'Téléphone requis' },
        { status: 400 }
      );
    }

    // Name required
    const fullName = firstName && lastName ? `${firstName} ${lastName}` : (name || email.split('@')[0]);
    if (!fullName || (firstName && !lastName) || (!firstName && lastName)) {
      return NextResponse.json(
        { error: 'Prénom et nom requis' },
        { status: 400 }
      );
    }

    // License validation (optional but recommended)
    if (licenseNumber) {
      const valid = await isLicenseValid(licenseNumber);
      if (!valid) {
        return NextResponse.json(
          { error: 'Numéro de licence invalide' },
          { status: 400 }
        );
      }
    }

    const user = await registerUser(
      email.toLowerCase(),
      password,
      fullName,
      licenseNumber,
      phone
    );

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l\'inscription' },
      { status: 400 }
    );
  }
}