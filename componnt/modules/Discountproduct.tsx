import Image from "next/image";
import React from "react";
import Button from "@componnt/modules/button";
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

export default function DiscountProducts(props: SliderProdouctProps) {
  const productSlug = props.description.replace(/\s+/g, '-'); // تبدیل فاصله‌ها به خط تیره







 
  
  return (
    <div className="flex flex-col items-center justify-center px-[15px] mt-4">
    <Link href={`/item/${productSlug}`}>
      <div className="relative">
        <Image
          width={302}
          height={302}
          src={`/fill-font-img-svg-icon/images${props.images[0]}`}
          alt=""
        />
        {props.discountPercent !==0 && (
          <div className="bg-[#B0A27B] w-[50px] h-[50px] flex items-center justify-center absolute text-white rounded-full text-Yekan right-[7px] top-[7px]">
            <p className="text-IRANSansWeb_Light ml-[1px]">%</p>{" "}
            {props.discountPercent}
          </div>
        )}
      </div>
      <p className="mt-4 mb-[11px] text-center text-charcoal text-lg leading-[25px] font-bold">
        {props.title}{" "}
      </p>
    </Link>
<div className="flex items-center justify-center gap-[5px] mb-2">
        <p
          className="relative text-lg text-[#BBBBBB] leading-[36px] text-Yekan after:content-[''] after:absolute after:h-[1.71px] 
               after:w-full after:bg-[#BBBBBB] after:left-0 
              after:right-0 
              after:top-1/2 
              "
        >
          {props.price} تومان
        </p>
        <p className="text-xl text-sand-beige leading-[40px] text-Yekan">
          {props.finalPrice} تومان
        </p>
      </div      >
      <Button id={props._id} />
    </div>
  );
}
