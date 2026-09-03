import { cookies } from 'next/headers';
import { verifyJwt, TokenPayload } from './jwt';
import { prisma } from '../db/prisma';
import { Role } from '@prisma/client';

export const AUTH_COOKIE_NAME = 'bigbike_session_token';

export async function getCurrentSession(): Promise<TokenPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) return null;
  return verifyJwt(token);
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      customer: {
        include: {
          membershipTier: true,
        },
      },
    },
  });

  return user;
}

export async function requireAuth(allowedRoles?: Role[]) {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  if (allowedRoles && !allowedRoles.includes(session.role)) {
    throw new Error('Forbidden: Insufficient permissions');
  }

  return session;
}
