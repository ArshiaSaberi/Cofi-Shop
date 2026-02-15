import { NextResponse } from "next/server";
import Conecttodb from "../../../../database/db";
import modeluser from "../../../../MOLDS/users";
import { verifyToken } from "../../../../utils/auth";
import { cookies } from "next/headers";

export const GET = async () => {
  try {
    await Conecttodb();

    // ⬇️ حتماً await
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ data: null, error: null }, { status: 200 });
    }

    const decoded = await verifyToken(token);

    if (!decoded || !decoded.email) {
      return NextResponse.json({ data: null, error: null }, { status: 200 });
    }

    const user = await modeluser.findOne({ email: decoded.email }).populate("cart").populate("comment").populate("question");

    return NextResponse.json({ data: user, error: null });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ data: null, error: null }, { status: 200 });
  }
};
