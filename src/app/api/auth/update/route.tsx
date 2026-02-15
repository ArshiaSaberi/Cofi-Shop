import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Conecttodb from "database/db";
import { hashPassword, verifyPassword, verifyToken } from "@utils/auth";
import modeluser from "@MOLDS/users";

export const POST = async (req: NextRequest) => {
  try {
    await Conecttodb();

    // ۱. بررسی توکن
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "لطفا ابتدا وارد حساب خود شوید" }, { status: 401 });
    }

    const isvalid = await verifyToken(token);
    if (!isvalid) {
      return NextResponse.json({ error: "نشست شما منقضی شده است" }, { status: 401 });
    }

    // انتخاب کاربر به همراه پسورد برای مقایسه
    const user = await modeluser.findOne({ email: isvalid.email }).select("+password");
    if (!user) {
      return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
    }

    const body = await req.json();
    const { firstName, lastName, currentPassword, newPassword, imageBase64 } = body;

    // ۲. آپدیت نام
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;

    // ۳. تغییر رمز عبور
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "وارد کردن رمز عبور فعلی الزامی است" }, { status: 400 });
      }

      const isCorrect = await verifyPassword(currentPassword, user.password);
      if (!isCorrect) {
        return NextResponse.json({ error: "رمز عبور فعلی اشتباه است" }, { status: 422 });
      }

      user.password = await hashPassword(newPassword);
    }

    // ۴. آپلود عکس (فیلد img طبق دیتابیس شما)
    if (imageBase64) {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

      if (user.img && user.img.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), "public", user.img);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const fileName = `user-${user._id}-${Date.now()}.png`;
      const filePath = path.join(uploadsDir, fileName);

      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      if (buffer.length > 2 * 1024 * 1024) {
        return NextResponse.json({ error: "حجم عکس نباید بیشتر از ۲ مگابایت باشد" }, { status: 400 });
      }

      fs.writeFileSync(filePath, buffer);
      user.img = `/uploads/${fileName}`; // ذخیره در فیلد img
    }

    await user.save();

    return NextResponse.json({ 
      message: "اطلاعات با موفقیت بروزرسانی شد",
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.img 
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("Server Error:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
};