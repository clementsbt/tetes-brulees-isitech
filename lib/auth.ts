import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'change-me-in-production');

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ userId, email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; email: string };
  } catch {
    return null;
  }
}

// ============ Auth Actions ============

export async function registerUser(email: string, password: string, name: string, ffvlLicense?: string, phone?: string) {
  const db = await prisma();
  
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email déjà utilisé');
  }

  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      ffvlLicense,
      phone,
      validated: !!ffvlLicense,
    },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const db = await prisma();
  
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const token = await createToken(user.id, user.email);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      ffvlLicense: user.ffvlLicense,
      role: user.role,
    },
  };
}

export async function getUserFromToken(token: string) {
  const payload = await verifyToken(token);
  if (!payload) return null;

  const db = await prisma();
  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      ffvlLicense: true,
      role: true,
      validated: true,
      notifyOnNewEvent: true,
    },
  });

  return user;
}