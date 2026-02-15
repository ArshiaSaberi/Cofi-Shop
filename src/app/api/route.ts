import { NextRequest, NextResponse } from "next/server";
import Conecttodb from "../../../database/db";
import prodouct  from "../../../MOLDS/prodouct";

export async function POST(req:NextRequest) {
  try {
    // اتصال به دیتابیس
    await Conecttodb();
    const body = await req.json();
console.log(body);


 await prodouct.create(body);
    return NextResponse.json({ "salam":"arshia" });
  } catch (err) {
    console.error("❌ Error fetching popular searches:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
