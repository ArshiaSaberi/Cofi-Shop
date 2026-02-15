import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../database/db";
import SearchSchema from "../../../../MOLDS/Search";

export async function POST(req: NextRequest) {
  try {
    // گرفتن داده از بادی ریکوئست
    const body = await req.json();
    const term = body?.term;

    if (!term?.trim()) {
      return NextResponse.json({ error: "Invalid term" }, { status: 400 });
    }

    // اتصال به دیتابیس
    await connectDB();

    // چک می‌کنه آیا این عبارت قبلاً جستجو شده یا نه
    const existing = await SearchSchema.findOne({ term });

    if (existing) {
      existing.count++;
      existing.updatedAt = new Date();
      await existing.save();
    } else {
      await SearchSchema.create({ term });
    }

    return NextResponse.json({ message: "Search saved" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
