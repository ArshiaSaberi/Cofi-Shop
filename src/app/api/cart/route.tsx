import { NextRequest, NextResponse } from "next/server";
import Cart from "@MOLDS/Cart";
import connectDB from "database/db";
import { HydratedDocument } from "mongoose";
import { AuthPayload, verifyToken } from "@utils/auth";

// اتصال به دیتابیس
connectDB();

// تعریف نوع آیتم داخل سبد خرید
interface CartItem {
  product: string; // Product ID
  quantity: number;
  price: number;
  finalPrice: number;
}

// تعریف نوع body درخواست POST
interface PostCartBody {
  user: string; // User ID
  product: string; // Product ID
  quantity: number;
  price: number;
  finalPrice: number;
}

// تایپ‌های Cart
interface CartType {
  user: string;
  items: CartItem[];
  totalPrice?: number;
  totalQuantity?: number;
}

// تایپ خروجی GET
interface GetCartsResponse {
  carts: CartType[];
}

interface ErrorResponse {
  message: string;
}

type GetCartsResult = GetCartsResponse | ErrorResponse;

export async function GET(req: NextRequest): Promise<NextResponse<GetCartsResult>> {
  try {
    // گرفتن توکن از کوکی
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { carts: [], message: "توکن موجود نیست" },
        { status: 401 }
      );
    }

    // بررسی توکن
    let decoded: AuthPayload | null = null;
    try {
      decoded = await verifyToken(token);
    } catch {
      return NextResponse.json(
        { carts: [], message: "توکن نامعتبر" },
        { status: 401 }
      );
    }

    const userId = decoded?.id;
    if (!userId) {
      return NextResponse.json(
        { carts: [], message: "توکن نامعتبر" },
        { status: 401 }
      );
    }

    // گرفتن کارت‌ها با safe check
    let carts: HydratedDocument<CartType>[] = [];
    try {
      carts = await Cart.find({
        user: userId,
        status: "active",
      }).populate({
        path: "items.product",
        select: "_id name price", // فقط فیلدهای ضروری
      });
    } catch (err) {
      console.error("DB ERROR:", err);
      return NextResponse.json(
        { carts: [], message: "خطای دیتابیس" },
        { status: 500 }
      );
    }

    // فرمت امن کارت‌ها
    const formattedCarts: CartType[] = (carts || []).map((cart) => ({
      ...cart.toObject(),
      totalPrice: Array.isArray(cart.items)
        ? cart.items.reduce((sum, item) => sum + (item.finalPrice ?? 0), 0)
        : 0,
      totalQuantity: Array.isArray(cart.items)
        ? cart.items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)
        : 0,
    }));

    return NextResponse.json({ carts: formattedCarts });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return NextResponse.json(
      { carts: [], message: "خطای سرور" },
      { status: 500 }
    );
  }
}

// ---------------- POST Cart ----------------
export async function POST(req: NextRequest) {
  try {
    const body: PostCartBody = await req.json();

    const { user, product, quantity, price, finalPrice } = body;

    // اعتبارسنجی ساده
    if (!user || !product || !quantity || !price || !finalPrice) {
      return NextResponse.json(
        { message: "تمام فیلدها الزامی است" },
        { status: 400 }
      );
    }

    // پیدا کردن سبد موجود
    let cart = await Cart.findOne({ user });

    if (!cart) {
      cart = new Cart({ user, items: [] });
    }

    // بررسی محصول موجود در سبد
    const existingIndex = cart.items.findIndex(
      (item: CartItem) => item.product.toString() === product
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].price = price;
      cart.items[existingIndex].finalPrice = finalPrice;
    } else {
      cart.items.push({ product, quantity, price, finalPrice });
    }

    await cart.save();

    return NextResponse.json({
      message: "محصول با موفقیت اضافه شد",
      cart,
      totalPrice: cart.totalPrice,
      totalQuantity: cart.totalQuantity,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "خطای سرور" }, { status: 500 });
  }
}
