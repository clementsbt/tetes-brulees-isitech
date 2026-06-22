import { randomBytes } from 'crypto';
import { prisma } from './prisma';
import { sendPasswordResetEmail } from './email';
import { hashPassword } from './auth';

const RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour

console.log('[DEBUG] requestPasswordReset started', process.env.RESEND_API_KEY?.slice(0, 10), process.env.FROM_EMAIL);

export async function requestPasswordReset(email: string, baseUrl: string) {
  const db = await prisma();
  
  console.log('[DEBUG] Looking for user:', email);
  
  const user = await db.user.findUnique({ where: { email } });
  
  console.log('[DEBUG] Found user:', !!user);
  
  // Always return success (security - don't reveal if email exists)
  if (!user) {
    console.log('[DEBUG] No user found, returning success without sending email');
    return { success: true, message: 'Si un compte existe, un email sera envoyé' };
  }

  // Generate reset token
  const token = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY);
  console.log('[DEBUG] Generated token:', token.slice(0, 8));

  // Save to DB
  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expires,
    },
  });

  // Send email
  const resetUrl = `${baseUrl}/password-reset?token=${token}`;
  console.log('[DEBUG] Sending email to:', email, 'resetUrl:', resetUrl);
  await sendPasswordResetEmail(email, resetUrl);

  return { success: true, message: 'Si un compte existe, un email sera envoyé' };
}

export async function resetPassword(token: string, newPassword: string) {
  const db = await prisma();
  
  const resetToken = await db.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    throw new Error('Token invalide');
  }

  if (resetToken.used) {
    throw new Error('Token déjà utilisé');
  }

  if (new Date() > resetToken.expires) {
    throw new Error('Token expiré');
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update user password and mark token as used
  await db.$transaction([
    db.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    }),
    db.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    }),
  ]);

  return { success: true };
}