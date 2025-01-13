"use server";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.SECRET_KEY);
const cookie = {
  name: "session",
  options: { httpOnly: true, secure: true, sameSite: 'lax', path: '/' } satisfies Partial<ResponseCookie>,
  duration: 7 * 24 * 60 * 60 * 1000,
}

export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1week')
    .sign(key)
}

export async function decrypt(session: string) {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null;
  }
}

export async function createSession(userId: number) {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + cookie.duration);

  const session = await encrypt({ userId, expires });
  cookieStore.set(cookie.name, session, { ...cookie.options, expires });
  return session;
}

export async function verifySession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(cookie.name);
  if (!sessionCookie?.value) {
    return null;
  }

  const session = await decrypt(sessionCookie.value);
  if (!session?.userId) {
    return null;
  }

  return { userId: session.userId };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookie.name);
}
