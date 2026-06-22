import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserFromToken } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const user = await getUserFromToken(token);

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user });
}