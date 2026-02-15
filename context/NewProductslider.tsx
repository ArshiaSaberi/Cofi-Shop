"use client";

import { createContext, ReactNode, useState } from "react";

// ۱. تایپ Context
interface NewProductContextType {
  nameProduct: string;
  setnamecontext: (value: string) => void;
}

// ۲. مقدار اولیه فقط برای تایپ
export const NewProductContext = createContext<NewProductContextType>({
  nameProduct: "انواع قهوه",
  setnamecontext: () => {}, // تابع خالی اولیه
});

// ۳. ساخت Provider
interface NewProductProviderProps {
  children: ReactNode;
}

export function NewProductProvider({ children }: NewProductProviderProps) {
  const [nameProduct, setnamecontext] = useState("انواع قهوه");

  return (
    <NewProductContext value={{ nameProduct, setnamecontext }}>
      {children}
    </NewProductContext>
  );
}
