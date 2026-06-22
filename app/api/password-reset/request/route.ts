import { NextResponse } from 'next/server';
import { requestPasswordReset } from '@/lib/password-reset';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const result = await requestPasswordReset(email, process.env.NEXT_PUBLIC_BASE_URL || 'https://tetes-brulees.vercel.app');

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}