import Question from "@MOLDS/Question";
import modeluser from "@MOLDS/users";
import Conecttodb from "database/db";
import { NextRequest, NextResponse } from "next/server";

// --- متد GET: دریافت اطلاعات یک پرسش خاص ---
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await Conecttodb();
    const x = await params; // دریافت id از params

    const question = await Question.findById(x.id);

    if (!question) {
      return NextResponse.json({ message: "پرسش یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(question, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطای سرور", error }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await Conecttodb();

    const x = await params;
    const { answer, adminId } = await req.json();

    // ✅ اعتبارسنجی
    if (!answer || answer.trim().length < 2) {
      return NextResponse.json(
        { message: "متن پاسخ معتبر نیست" },
        { status: 400 }
      );
    }

    if (!adminId) {
      return NextResponse.json(
        { message: "شناسه ادمین ارسال نشده" },
        { status: 400 }
      );
    }

    // 🔍 گرفتن اطلاعات ادمین از دیتابیس
    const admin = await modeluser.findById(adminId);
    if (!admin) {
      return NextResponse.json({ message: "ادمین یافت نشد" }, { status: 404 });
    }

    // ✅ اضافه کردن پاسخ جدید به آرایه answers
    const updatedQuestion = await Question.findByIdAndUpdate(
      x.id,
      {
        $push: {
          answers: {
            text: answer.trim(),
            answeredAt: new Date(),
            answeredBy: {
              _id: admin._id,
              firstname: admin.firstname,
              lastname: admin.lastname,
              email: admin.email,
              role: admin.role,
            },
          },
        },
      },
      { new: true }
    );

    if (!updatedQuestion) {
      return NextResponse.json({ message: "پرسش یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      message: "پاسخ با موفقیت ثبت شد",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error("ANSWER ERROR:", error);
    return NextResponse.json({ message: "خطا در ثبت پاسخ" }, { status: 500 });
  }
}
