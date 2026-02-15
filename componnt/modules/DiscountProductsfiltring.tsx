import Image from "next/image";
import React from "react";
import Button from "./button";
import Link from "next/link";

interface SliderProdouctProps {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  discountPercent: number;
  finalPrice: number;
}

export default function DiscountProductsfiltring(props: SliderProdouctProps) {
  const productSlug = props.description.replace(/\s+/g, '-'); // تبدیل فاصله‌ها به خط تیره

  return (
    <div className="flex flex-col items-center justify-center h-[368px] px-[10px] py-[15px] sm:p-[15px] bg-[hsl(0,0%,100%)] rounded-lg gap-2">
      <Link href={`/item/${productSlug}`}>
      <div className="relative">
        <Image
          width={150}
          height={150}
          className="border-[hsl(240_3%_12%_/_0.1)] border rounded-sm  max-[400px]:max-w-[145px] max-[400px]:max-h-[145px]" 
                   src={`/fill-font-img-svg-icon/images${props.images[0]}`}

          alt=""
        />
        {props.discountPercent !==0 && (
          <div className="bg-[#B0A27B] w-[35px] h-[35px] flex items-center justify-center absolute text-white rounded-full text-Yekan right-[7px] top-[7px] text-sm">
            <p className="text-IRANSansWeb_Light ml-[1px]">%</p>{" "}
            {props.discountPercent}
          </div>
        )}
      </div>
      <p className="mt-4 mb-[11px] text-charcoal text-base leading-[25px] font-bold h-12 text-center">
        {props.title}{" "}
      </p>
      </Link>
      <div className="flex items-center justify-center flex-col m-auto max-[400px]:flex-row gap-2">
        <p
          className="relative text-base text-[#BBBBBB] leading-[36px] text-Yekan after:content-[''] after:absolute after:h-[1.71px] 
               after:w-full after:bg-[#BBBBBB] after:left-0 
              after:right-0 
              after:top-1/2 
              "
        >
          {props.finalPrice === props.price ? (<></>) : (
            <>
          {props.price} تومان
            </>
           ) }
        </p>
        <p className="text-lg text-sand-beige text-Yekan ">
          {props.finalPrice} تومان
        </p>
      </div>
      <Button id={props._id} />
    </div>
  );
}
