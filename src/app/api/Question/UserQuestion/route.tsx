import Question from "@MOLDS/Question";
import { verifyToken } from "@utils/auth";
import Conecttodb from "database/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await Conecttodb();

    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ data: [] });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ data: [] });

    const questions = await Question.find({
      userId: decoded.id,
    });

    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch {
    return NextResponse.json({
      success: false,
      data: [],
    });
  }
}
