"use client"
import { NewProductProvider } from "../../context/NewProductslider";
import { NewProductsSlidertext, Product } from "./swiper";

export function NewProductslider(){
    return(

        <NewProductProvider>
        <div className="flex items-center justify-center">
          <NewProductsSlidertext />
        </div>
  
        <div className="flex items-center justify-evenly pb-[64px] containers">
          <Product />
        </div>
      </NewProductProvider>

    )
}