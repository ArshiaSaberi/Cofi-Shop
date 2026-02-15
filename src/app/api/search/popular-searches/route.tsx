import Conecttodb from "../../../../../database/db";
import SearchSchema from "../../../../../MOLDS/Search";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // اتصال به دیتابیس
    await Conecttodb();

    // یک هفته اخیر
    const weekAgo = new Date(Date.now() - 7);
    const now = new Date();

    // پیدا کردن ۵ تا عبارت با بیشترین تعداد جستجو
    const popular = await SearchSchema.find({
      $or: [
        { updatedAt: { $gte: weekAgo, $lte: now } },
        { updatedAt: { $exists: false } }, // برای داده‌هایی که updatedAt ندارند
      ],
    })
      .sort({ count: -1 })
      .limit(5);

    return NextResponse.json({ popular });
  } catch (err) {
    console.error("❌ Error fetching popular searches:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
