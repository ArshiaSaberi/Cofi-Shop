import Comment from "@MOLDS/Comment";
import Conecttodb from "database/db";
import { NextResponse } from "next/server";

export async function GET() {
  await Conecttodb();
  try {
    const comment = await Comment.find();
    return NextResponse.json({ success: true, data: comment });
  } catch (err) {
    console.error("GET /api/Comment ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
