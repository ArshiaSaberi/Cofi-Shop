"use client";
import { useEffect, useState } from "react";
import Productscart from "@componnt/modules/Productscart";
import DetailsPriceCart from "@componnt/modules/DetailsPriceCart";

// --- Types ---
export interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  brand?: string;
  title: string;
  count?: number;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
  finalPrice: number;
}

export interface CartType {
  _id: string;
  items: CartItem[];
  totalPrice: number;
  totalQuantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartType | null>(null);

  useEffect(() => {
    const fetchDatacart = async () => {
      try {
        const cartRes = await fetch("/api/cart");
        const res = await cartRes.json();
        if (res.carts?.length > 0) setCart(res.carts[0]);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchDatacart();
  }, []);

  // تابع جادویی برای آپدیت آنی قیمت و لیست
  const handleUpdateUI = (itemId: string, newQuantity: number | null) => {
    if (!cart) return;

    let updatedItems: CartItem[];
    if (newQuantity === null) {
      updatedItems = cart.items.filter((item) => item._id !== itemId);
    } else {
      updatedItems = cart.items.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      );
    }

    // محاسبه آنی مقادیر سمت چپ
    const newTotalQty = updatedItems.reduce((acc, item) => acc + item.quantity, 0);
    const newTotalPrc = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    setCart({
      ...cart,
      items: updatedItems,
      totalQuantity: newTotalQty,
      totalPrice: newTotalPrc,
    });
  };

  if (!cart) return <div className="p-10 text-center text-Yekan">در حال بارگذاری...</div>;

  return (
    <div className="flex items-start justify-between w-full gap-4 max-w-7xl mx-auto p-4" dir="rtl">
      <Productscart items={cart.items} onUpdate={handleUpdateUI} />
      <DetailsPriceCart cart={cart} />
    </div>
  );
}