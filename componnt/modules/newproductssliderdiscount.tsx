"use client";
import { NewProductProvider } from "../../context/NewProductslider";
import { NewProductsSlidertext, Productdis } from "./swiper";

export function NewProductsliderDiscount() {
  return (
    <NewProductProvider>
      <div className="flex items-center justify-center">
        <NewProductsSlidertext />
      </div>

      <div className="flex items-center justify-evenly pb-[64px] containers">
        <Productdis />
      </div>
    </NewProductProvider>
  );
}
