"use client";

import { IUser } from "@MOLDS/users";
import { useState } from "react";
import { toast, Bounce } from "react-toastify";

interface ProductData {
  _id: string;
  title: string;
  price: number;
  finalPrice: number;
  count: number; // موجودی محصول
}

interface CartItem {
  _id: string;
  product?: ProductData;
  quantity: number;
}

interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  status: string;
  totalPrice: number;
  totalQuantity: number;
}

interface GetCartsResponse {
  carts: Cart[];
}

export default function Button({ id }: { id: string }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const clickHandler = async () => {
    setLoading(true);

    try {
      // دریافت محصول
      const res = await fetch(`/api/prodouct/${id}`);
      if (!res.ok) throw new Error("Failed to fetch product");
      const productData: ProductData = await res.json();

      // دریافت کاربر
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (!token?.trim()) throw new Error("لطفا اول وارد شوید");

      const userRes = await fetch("/api/auth", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!userRes.ok) throw new Error("Failed to fetch user");
      const userJson = await userRes.json();
      const userData: IUser = userJson.data;
      setUser(userData);

      // دریافت سبد خرید
      const cartRes = await fetch("/api/cart", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!cartRes.ok) throw new Error("Failed to fetch cart");
      const cartJson: GetCartsResponse = await cartRes.json();

      // گرفتن items از اولین cart فعال
      const cart = cartJson.carts.find((c) => c.status === "active");
      const items: CartItem[] = cart?.items || [];

      // پیدا کردن محصول در سبد خرید
      const userCartItem = items.find(
        (item) => item.product?._id === productData._id
      );

      const currentQuantity = userCartItem ? userCartItem.quantity : 0;

      // تعداد واقعی قابل اضافه شدن
      const remaining = productData.count - currentQuantity;

      if (remaining <= 0) {
        toast.error(
          `نمیتوان بیش از ${productData.count} عدد از این محصول انتخاب کرد.`,
          {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            transition: Bounce,
          }
        );
        setLoading(false);
        return;
      }

      // اضافه کردن 1 واحد یا حداکثر باقی‌مانده
      const quantityToAdd = Math.min(1, remaining);

      // ارسال به سرور
      const addCartRes = await fetch("/api/cart", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userData._id,
          product: productData._id,
          quantity: quantityToAdd,
          price: productData.price,
          finalPrice: productData.finalPrice,
        }),
      });

      if (!addCartRes.ok) {
        const errJson = await addCartRes.json();
        throw new Error(errJson.message || "Failed to add product to cart");
      }

      window.dispatchEvent(new Event("cartUpdated"));

      toast.success("محصول با موفقیت به سبد خرید اضافه شد!", {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } catch (err: unknown) {
      let message = "خطایی رخ داد";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "string") {
        message = err;
      }
      toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      onClick={clickHandler}
      className={`bg-[#7F6051] text-sm rounded-[50px] text-white min-h-[38px] w-[132px] flex items-center justify-center mt-auto cursor-pointer ${
        loading ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {loading ? (
        <span className="flex space-x-1">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce animation-delay-200">.</span>
          <span className="animate-bounce animation-delay-400">.</span>
        </span>
      ) : (
        "افزودن به سبد خرید"
      )}
    </div>
  );
}
