import Conecttodb from "database/db";
import Product from "@MOLDS/prodouct";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } } // استفاده از context برای دریافت params
) {
  try {
    await Conecttodb();

    // نکته مهم: اینجا باید params را await کنید
    const { id } = await context.params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
