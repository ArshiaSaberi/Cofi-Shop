import { NextRequest, NextResponse } from "next/server";
import Conecttodb from "../../../../database/db";
import modeluser from "../../../../MOLDS/users";
import { verifyToken } from "../../../../utils/auth";

export const GET = async (req: NextRequest) => {
  try {
    await Conecttodb();

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Token not found", data: null },
        { status: 401 }
      );
    }

    const isvalid = await verifyToken(token);

    if (!isvalid) {
      return NextResponse.json(
        { error: "Invalid token", data: null },
        { status: 401 }
      );
    }

    // پیدا کردن کاربر
    const user = await modeluser
      .findOne({ email: isvalid.email })
      .lean()
    
      
    if (!user) {
      return NextResponse.json(
        { error: "User not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user, error: null });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message, data: null }, { status: 500 });
  }
};
