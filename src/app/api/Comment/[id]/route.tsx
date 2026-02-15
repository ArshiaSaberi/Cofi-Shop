// app/api/Comment/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Conecttodb from "database/db";
import Comment from "@MOLDS/Comment";
import { Types } from "mongoose";

type MongoDuplicateKeyError = {
  code: number;
};

interface PutBody {
  action: "like" | "dislike";
  userId: string;
}
interface Params {
  id: string;
}

function isDuplicateKeyError(err: unknown): err is MongoDuplicateKeyError {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code?: unknown }).code === "number"
  );
}

// ================= GET =================
export async function GET(
  req: NextRequest,
  context: { params: Params } // این دقیقا باید همینه
) {
  try {
    await Conecttodb();

    const productId = await context.params;

    if (!productId.id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    // پیدا کردن کامنت‌ها برای محصول
    const comments = await Comment.find({ productId: productId.id })
      .populate("userId")
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({ success: true, data: comments });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("GET comments error:", message);
    return NextResponse.json(
      { success: false, message: "Error fetching comments" },
      { status: 500 }
    );
  }
}

// ================= POST =================
export async function POST(
  req: NextRequest,
  context: { params: Params } // این دقیقا باید همینه
) {
  try {
    await Conecttodb();

    const productId =  context.params;
    console.log("ProductId for POST:", productId, "✅","11111");

    if (!productId.id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // ایجاد کامنت جدید
    const newComment = await Comment.create({
      ...body,
      isActive: false,
      productId: productId.id,
    });

    // اگر میخوای populate کاربر هم بکنی، اینجا انجام بده
    // const populatedComment = await newComment.populate('user');

    return NextResponse.json({ success: true, data: newComment });
  } catch (err: unknown) {
    if (isDuplicateKeyError(err) && err.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "شما قبلاً برای این محصول نظر ثبت کرده‌اید",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "خطا در ثبت دیدگاه" },
      { status: 500 }
    );
  }
}

export const PUT = async (
  req: NextRequest,
  context: { params: Params } // این دقیقا باید همینه
) => {
  try {
    await Conecttodb();

    const commentId =await context.params;
    const body: PutBody = await req.json();
    const { action, userId } = body;

    if (!userId || !["like", "dislike"].includes(action)) {
      return NextResponse.json(
        { success: false, message: "Invalid data" },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId.id).exec();

    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    comment.likedBy = Array.isArray(comment.likedBy) ? comment.likedBy : [];
    comment.dislikedBy = Array.isArray(comment.dislikedBy)
      ? comment.dislikedBy
      : [];

    const userObjectId = new Types.ObjectId(userId);

    // بررسی اینکه کاربر قبلاً لایک یا دیسلایک زده
    const hasLiked =
      comment.likedBy.findIndex((u: Types.ObjectId) =>
        u.equals(userObjectId)
      ) !== -1;

    const hasDisliked =
      comment.dislikedBy.findIndex((u: Types.ObjectId) =>
        u.equals(userObjectId)
      ) !== -1;

    if (action === "like") {
      if (comment.Like > 0) {
        if (hasLiked) {
          comment.Like = 0;
          comment.likedBy = comment.likedBy.filter(
            (u: Types.ObjectId) => !u.equals(userObjectId)
          );
        }
      }
      if (!hasLiked) {
        // اضافه کردن لایک فقط اگر قبلاً لایک نزده
        comment.likedBy.push(userObjectId);
      }
      // حذف کاربر از دیسلایک در هر صورت
      if (hasDisliked) {
        comment.dislikedBy = comment.dislikedBy.filter(
          (u: Types.ObjectId) => !u.equals(userObjectId)
        );
      }
    }

    if (action === "dislike") {
      if (comment.Dislike > 0) {
        if (hasDisliked) {
          comment.Dislike = 0;
          comment.dislikedBy = comment.dislikedBy.filter(
            (u: Types.ObjectId) => !u.equals(userObjectId)
          );
        }
      }

      if (!hasDisliked) {
        // اضافه کردن دیسلایک فقط اگر قبلاً دیسلایک نزده
        comment.dislikedBy.push(userObjectId);
      }
      // حذف کاربر از لایک در هر صورت
      if (hasLiked) {
        comment.likedBy = comment.likedBy.filter(
          (u: Types.ObjectId) => !u.equals(userObjectId)
        );
      }
    }

    // Sync تعداد لایک و دیسلایک
    comment.Like = comment.likedBy.length;
    comment.Dislike = comment.dislikedBy.length;

    await comment.save();

    return NextResponse.json({
      success: true,
      data: comment,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
};
