import { NextRequest, NextResponse } from "next/server";
import Conecttodb from "database/db";
import Question from "@MOLDS/Question";

/* ================= GET ================= */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await Conecttodb();

    const productId = await params;
    if (!productId.id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const questions = await Question.find({ productId: productId.id })
      .populate("userId")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: questions });
  } catch (err) {
    console.error("GET questions error:", err);
    return NextResponse.json(
      { success: false, message: "Error fetching questions" },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await Conecttodb();

    const productId = await params;
    if (!productId.id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { question, userId } = body;

    if (!question || !userId) {
      return NextResponse.json(
        { success: false, message: "Question and userId are required" },
        { status: 400 }
      );
    }

    const newQuestion = await Question.create({
      question,
      userId,
      isActive:false,
      productId: productId.id,
    });

    const populated = await newQuestion;

    return NextResponse.json({ success: true, data: populated });
  } catch (err) {
  console.error("POST question error:", err);
  return NextResponse.json(
    { success: false, message: err instanceof Error ? err.message : "Unknown error" },
    { status: 500 }
  );
}

}
