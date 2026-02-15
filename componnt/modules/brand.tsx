import React from "react";
import { bradns, Categorybrand } from "@utils/brand/db";
import Image from "next/image";

export function Brand() {
  return (
    <div className="mt-[60px] flex items-center justify-evenly flex-wrap relative">
      <Image
        className="absolute top-[-116px] right-[206px] max-lg:hidden"
        src="/fill-font-img-svg-icon/images/SVG.png"
        alt=""
        width={50}
        height={50}
      />
      {bradns.map((brand: Categorybrand) => {
        return (
          <div
            className="border-[#AC988D] border-2 rounded-[800px] w-[108px] h-[165px] flex items-center justify-evenly flex-col relative mb-10 mx-[86px] max-sm:my-5 max-sm:mx-5"
            key={brand.id}
          >
            <Image
            
              className="rounded-full"
              src={brand.src}
              alt=""
              width={74}
              height={74}
            />

            <p className="font-bold teaxt-[22px] leading-[56px]">
              {brand.name}
            </p>
          </div>
        );
      })}
      <Image
        className="absolute bottom-[-116px] left-[206px] max-lg:hidden"
        src="/fill-font-img-svg-icon/images/SVG.png"
        alt=""
        width={50}
        height={50}
      />
    </div>
  );
}
