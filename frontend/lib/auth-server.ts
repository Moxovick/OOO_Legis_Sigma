import { SignJWT, jwtVerify } from 'jose';
import { NextRequest } from 'next/server';

const secret = () => {
  const key = process.env.SECRET_KEY;
  if (!key) throw new Error('Missing SECRET_KEY');
  return new TextEncoder().encode(key);
};

const ACCESS_EXPIRE = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || '15') * 60;
const REFRESH_EXPIRE = parseInt(process.env.REFRESH_TOKEN_EXPIRE_MINUTES || '60') * 60;

export async function signAccessToken(adminId: number): Promise<string> {
  return new SignJWT({ sub: String(adminId), type: 'access' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${ACCESS_EXPIRE}s`)
    .sign(secret());
}

export async function signRefreshToken(adminId: number): Promise<string> {
  return new SignJWT({ sub: String(adminId), type: 'refresh' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(`${REFRESH_EXPIRE}s`)
    .sign(secret());
}

export async function verifyToken(token: string, type: 'access' | 'refresh'): Promise<number> {
  const { payload } = await jwtVerify(token, secret());
  if (payload.type !== type) throw new Error('Invalid token type');
  return parseInt(payload.sub as string, 10);
}

export async function requireAuth(req: NextRequest): Promise<number> {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (!token) throw new Error('Unauthorized');
  try {
    return await verifyToken(token, 'access');
  } catch {
    throw new Error('Unauthorized');
  }
}

export function refreshExpireDate(): Date {
  const d = new Date();
  d.setSeconds(d.getSeconds() + REFRESH_EXPIRE);
  return d;
}
