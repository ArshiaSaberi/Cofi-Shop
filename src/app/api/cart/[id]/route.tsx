"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Types } from "mongoose";
import Conecttodb from "database/db";
import Cart from "@MOLDS/Cart";
import { verifyToken } from "@utils/auth";

interface RouteParams {
  params: Promise<{ id: string }>; // در Next.js جدید باید Promise باشد
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    await Conecttodb();

    // ۱. دریافت ID محصول (حتماً await شود)
    const { id: itemId } = await params;

    if (!Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ message: "ID نامعتبر است" }, { status: 400 });
    }

    // ۲. احراز هویت (در Next.js 15 کوکی‌ها باید await شوند)
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "کاربر لاگین نیست" },
        { status: 401 }
      );
    }

    const decodedPayload = await verifyToken(token);
    if (!decodedPayload || typeof decodedPayload === "string") {
      return NextResponse.json(
        { message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    const userId = new Types.ObjectId(decodedPayload.id);
    const targetId = new Types.ObjectId(itemId);

    // ۳. عملیات حذف با متد نفوذی (تست روی هر دو فیلد احتمالی)
    // این دستور تلاش می‌کند آیتمی را حذف کند که یا _id آن یا فیلد product آن با itemId یکی باشد
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      {
        $pull: {
          items: {
            $or: [{ _id: targetId }, { product: targetId }],
          },
        },
      },
      { new: true }
    );

    // ۴. بررسی نتیجه واقعی در دیتابیس
    if (!updatedCart) {
      return NextResponse.json(
        { message: "سبد خرید یافت نشد" },
        { status: 404 }
      );
    }

    // چک کنید که آیا واقعاً چیزی از آرایه کم شده است یا خیر
    return NextResponse.json(
      {
        message: "محصول با موفقیت از دیتابیس حذف شد",
        cart: updatedCart,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Database Delete Error:", error.message);
    return NextResponse.json(
      { message: "خطای سرور: " + error.message },
      { status: 500 }
    );
  }
}


// PUT برای بروزرسانی تعداد محصول
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    await Conecttodb();

    // دریافت id محصول
    const { id: itemId } = await params;
    if (!Types.ObjectId.isValid(itemId)) {
      return NextResponse.json({ message: "ID نامعتبر است" }, { status: 400 });
    }

    // احراز هویت
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "کاربر لاگین نیست" },
        { status: 401 }
      );
    }

    const decodedPayload = await verifyToken(token);
    if (!decodedPayload || typeof decodedPayload === "string") {
      return NextResponse.json(
        { message: "توکن نامعتبر است" },
        { status: 401 }
      );
    }

    const userId = new Types.ObjectId(decodedPayload.id);

    // دریافت تعداد جدید از body
    const body = await req.json();
    const { quantity } = body;
    if (!quantity || typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { message: "تعداد نامعتبر است" },
        { status: 400 }
      );
    }

    const targetId = new Types.ObjectId(itemId);

    // بروزرسانی تعداد محصول
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId, "items._id": targetId },
      { $set: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!updatedCart) {
      return NextResponse.json(
        { message: "سبد خرید یا محصول یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "تعداد محصول بروزرسانی شد", quantity, cart: updatedCart },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Database Update Error:", error.message);
    return NextResponse.json(
      { message: "خطای سرور: " + error.message },
      { status: 500 }
    );
  }
}
