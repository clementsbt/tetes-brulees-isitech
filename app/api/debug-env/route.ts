import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasResend: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.FROM_EMAIL,
    keyPrefix: process.env.RESEND_API_KEY?.slice(0, 10),
  });
}