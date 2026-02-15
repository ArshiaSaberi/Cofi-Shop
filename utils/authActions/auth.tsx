"use server";

import Conecttodb from "../../database/db";
import modeluser from "../../MOLDS/users";
import {
  hashPassword,
  generateToken,
  verifyPassword,
  
} from "../../utils/auth";

// Server Action برای ثبت‌نام
export async function signupAction(formData: FormData) {
  await Conecttodb();

  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const firstname = formData.get("firstname")?.toString();
  const lastname = formData.get("lastname")?.toString();
  const email = formData.get("email")?.toString();

  // بررسی فیلدهای الزامی
  if (!email || !password || !firstname || !lastname || !username) {
    return { error: "تمام فیلدها الزامی است" };
  }

  // بررسی اینکه کاربر از قبل موجود نباشد
  const existingUser = await modeluser.findOne({
    $or: [{ email }],
  });
  if (existingUser) {
    return { error: "کاربر از قبل موجود است" };
  }

  const hashedPassword = await hashPassword(password);

  // ایجاد کاربر جدید
  const newUser = await modeluser.create({
    firstname,
    lastname,
    email,
    username,
    password: hashedPassword, // توجه کنید: pasword با s واحد
  });

  // تولید توکن
  const token = await generateToken({
    id: newUser._id.toString(),
    email: newUser.email,
  });

  return { message: "ثبت‌نام موفق", token };
}

// Server Action برای لاگین
export async function loginAction(formData: FormData) {
  await Conecttodb();

  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // بررسی فیلدهای الزامی
  if (!email || !password) {
    return { error: "ایمیل و رمز عبور الزامی است" };
  }

  // بررسی اینکه کاربر وجود دارد
  const user = await modeluser.findOne({ email });
  if (!user) {
    return { error: "کاربر یافت نشد" };
  }

  // بررسی صحت رمز عبور
  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    return { error: "رمز عبور اشتباه است" };
  }

  // تولید توکن
  const token = await generateToken({
    id: user._id.toString(),
    email: user.email,
  });

  return { message: "ورود موفق", token };
}

export async function deleteUserAction(token: string) {
  try {
    if (!token) throw new Error("Token not found");

    // اینجا فقط می‌خوای توکن رو منقضی کنی، دیتابیس دست نخورده می‌مونه
    // اگر JWT هست، می‌تونی سرور تایید کنه که این توکن باطل شده
    // ولی در ساده‌ترین حالت، حذف کوکی کافی است
    return { message: "Token expired successfully", data: null };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, data: null };
    }
    return { error: "Server error", data: null };
  }
}
