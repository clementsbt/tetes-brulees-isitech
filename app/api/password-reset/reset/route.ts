import { NextResponse } from 'next/server';
import { resetPassword } from '@/lib/password-reset';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: 'Token et nouveau mot de passe requis' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
    }

    const result = await resetPassword(token, password);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}