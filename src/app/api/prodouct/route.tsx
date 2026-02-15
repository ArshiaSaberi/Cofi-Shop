import { NextResponse } from "next/server";
import Conecttodb from "../../../../database/db";
import prodouct from "../../../../MOLDS/prodouct";

export async function GET() {
  try {
    await Conecttodb();

    const coffees = await prodouct.find();

    return NextResponse.json(coffees);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err });
  }
}
