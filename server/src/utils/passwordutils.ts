// server\src\utils\passwordutils.ts
import bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateRandomToken(): string {
  return Math.random().toString(36).substr(2);
}

export function generateRandomNumber(): number {
  return Math.floor(Math.random() * 1000000);
}

