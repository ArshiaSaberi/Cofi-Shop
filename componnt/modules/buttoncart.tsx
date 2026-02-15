"use client";
import React, { useState, FC, useEffect } from "react";
import { Bounce, toast } from "react-toastify";

interface BoutoonProps {
  value: {
    ccount: number; // حداکثر موجودی محصول
    quantity: number; // تعداد فعلی
    id: string;
  };
  onUpdate: (itemId: string, newQuantity: number | null) => void;
}

const toPersianNumber = (value: number | string) =>
  value.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

const Boutoon: FC<BoutoonProps> = ({ value, onUpdate }) => {
  const MAX_LIMIT = value.ccount > 0 ? value.ccount : 1;
  const initialCount = value.quantity > MAX_LIMIT ? MAX_LIMIT : value.quantity;

  const [count, setCount] = useState<number>(initialCount);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const correctedCount = value.quantity > MAX_LIMIT ? MAX_LIMIT : value.quantity;
    setCount(correctedCount);
  }, [value.quantity, MAX_LIMIT]);

  const updateQuantityDB = async (newQuantity: number) => {
    try {
      setIsUpdating(true);
      const res = await fetch(`/api/cart/${value.id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      if (!res.ok) throw new Error("خطا در بروزرسانی تعداد");
      const data = await res.json();
      return data.quantity;
    } catch (error) {
      toast.error("خطا در بروزرسانی تعداد");
      console.error(error);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  const increment = async () => {
    if (isDeleting || isUpdating) return;
    if (count < MAX_LIMIT) {
      const next = count + 1;
      setCount(next);
      const updated = await updateQuantityDB(next);
      if (updated !== null) onUpdate(value.id, updated);
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const decrement = async () => {
    if (isDeleting || isUpdating) return;
    if (count > 1) {
      const next = count - 1;
      setCount(next);
      const updated = await updateQuantityDB(next);
      if (updated !== null) onUpdate(value.id, updated);
      window.dispatchEvent(new Event("cartUpdated"));
    } else {
      deleteItem();
    }
  };

  const deleteItem = async () => {
    if (isDeleting) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/cart/${value.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("خطا در حذف");

      onUpdate(value.id, null);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("آیتم با موفقیت حذف شد", { transition: Bounce });
    } catch {
      toast.error("خطایی رخ داد");
    } finally {
      setIsDeleting(false);
    }
  };

  const isMax = count >= MAX_LIMIT;

  return (
    <div className="flex items-center font-sans" dir="rtl">
      <div className="flex items-center w-[110px] h-[40px] border border-sandstone rounded-lg bg-white overflow-hidden shadow-sm">
        {/* + */}
        <button
          onClick={increment}
          disabled={isMax || isDeleting || isUpdating}
          className={`flex items-center justify-center w-10 h-full transition-colors
            ${isMax || isDeleting || isUpdating
              ? "text-gray-300 cursor-not-allowed"
              : "text-sandstone hover:bg-blue-50 cursor-pointer"
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
          </svg>
        </button>

        {/* نمایش تعداد */}
        <div className="flex flex-col flex-1 h-full items-center justify-center border-x border-blue-100 relative">
          {isUpdating && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
              <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
            </div>
          )}
          <input
            type="text"
            value={toPersianNumber(count)}
            readOnly
            className={`w-full text-center font-bold focus:outline-none bg-transparent cursor-text
              ${isMax ? "text-[13px]" : "text-sm"}
              ${isDeleting ? "text-gray-400" : "text-coffee-brown"}
            `}
          />
          {count >= MAX_LIMIT && (
            <span className="text-[8px] text-gray-400 font-bold leading-none">
              حداکثر
            </span>
          )}
        </div>

        {/* - یا سطل */}
        <button
          onClick={decrement}
          disabled={isDeleting || isUpdating}
          className={`flex items-center justify-center w-10 h-full transition-colors
            ${isDeleting || isUpdating ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {count === 1 ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4.5 w-4.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sandstone" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Boutoon;
