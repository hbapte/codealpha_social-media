// src/utils/sessionUtils.ts
import { SignJWT, jwtVerify } from 'jose';
import { Request, Response, NextFunction } from 'express';
import Session from '../database/models/session'; 
import User from '../database/models/user'; 

const secretKey = process.env.JWT_SECRET || '5830d616e0ec3a0fb445c11ecf91b1d7118d3307d78af07926f3f1143e4bd2df';
const key = new TextEncoder().encode(secretKey);

export const encrypt = async (payload: { userId: string; names: string;  role: string; expiresAt: Date }) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(key);
};

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}

// src/utils/sessionUtils.ts
export const createSession = async (
  userId: string, names: string,   
  role: string, duration: string
) => {
  const expiresIn = duration === '28h' ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000 * 15;
  const expiresAt = new Date(Date.now() + expiresIn);
  const sessionToken = await encrypt({ userId, names,  role, expiresAt });

  // Save the session in the database
  await Session.create({
      userId,
      sessionToken,
      expiresAt
  });

  return sessionToken;
};


export const verifySession = async (token: string) => {
  try {
      const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });

      // Check if session exists in the database and has not expired
      const session = await Session.findOne({ sessionToken: token });
      if (!session || session.expiresAt < new Date()) {
          return null;
      }

      return payload; // Ensure this contains userId
  } catch (error) {
      console.error('Session verification error:', error);
      return null;
  }
};


export const deleteSession = async (token: string, res: Response) => {
  // Remove the session from the database
  await Session.deleteOne({ sessionToken: token });

  res.setHeader('Set-Cookie', 'session=; HttpOnly; Secure; Path=/; Max-Age=0; SameSite=Lax');
};
