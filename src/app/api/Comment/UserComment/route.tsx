import Comment from "@MOLDS/Comment";
import { verifyToken } from "@utils/auth";
import Conecttodb from "database/db";
import { NextRequest, NextResponse } from "next/server";

/* =========================
   GET → گرفتن کامنت‌های کاربر
========================= */
export async function GET(req: NextRequest) {
  try {
    await Conecttodb();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const comments = await Comment.find({
      userId: decoded.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: comments,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
