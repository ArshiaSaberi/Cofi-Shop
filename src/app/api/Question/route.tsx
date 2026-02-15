import Question from "@MOLDS/Question";
import Conecttodb from "database/db";
import { NextResponse } from "next/server";

export async function GET() {
  await Conecttodb();
  try {
    const question = await Question.find();
    return NextResponse.json({ success: true, data: question });
  } catch (err) {
    console.error("GET /api/Question ERROR:", err);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
