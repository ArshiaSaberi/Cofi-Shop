"use server";

import { hash, compare } from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

// ساختار اطلاعات داخل توکن
export interface AuthPayload extends JwtPayload {
  id: string;
  email: string;
}

// هش کردن پسورد
export const hashPassword = async (password: string): Promise<string> => {
  return hash(password, 12);
};

// تولید توکن
export const generateToken = async (data: AuthPayload): Promise<string> => {
  return jwt.sign(data, "arshia015", {
    expiresIn: "7d",
  });
};

// مقایسه پسورد با هش (ایمن)
export const verifyPassword = async (
  password: string,
  hashedPassword?: string
): Promise<boolean> => {
  if (!hashedPassword) return false; // اگر هش خالی بود false برگردون
  return compare(password, hashedPassword);
};

// بررسی توکن
export const verifyToken = async (token: string): Promise<AuthPayload | null> => {
  try {
    const decoded = jwt.verify(token, "arshia015") as AuthPayload; // فرض بر این که AuthPayload شامل userId هست
    return decoded;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};


