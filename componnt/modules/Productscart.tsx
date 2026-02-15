"use client";
import { CartItem } from "@/app/cart/page";
import Productcart from "@componnt/modules/Productcart";

interface ProductscartProps {
  items: CartItem[];
  onUpdate: (itemId: string, newQuantity: number | null) => void;
}

export default function Productscart({ items, onUpdate }: ProductscartProps) {
  return (
    <div className="w-[80%] ml-4 h-full flex flex-col gap-12 divide-y divide-[#0000001b]">
      {items.map((item) => (
        <Productcart key={item._id} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
}