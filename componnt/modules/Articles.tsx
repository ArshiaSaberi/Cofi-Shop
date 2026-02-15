import React from "react";
import { Articles } from "@utils/Articles/Articles";
import { Articlesi } from "@utils/Articles/Articles";
import Image from "next/image";

export function Articl() {
  return (
    <div className="mt-[50px] flex items-center justify-evenly flex-wrap gap-[30px] max-sm:hidden">
      {Articles.map((Article: Articlesi) => {
        return (
          <div
            className="bg-[#EBEBDC] rounded-[20px] w-[403px] h-[520px] flex flex-col mb-[50px]"
            key={Article.id}
          >
            <Image
              className="mb-[21px] rounded-[20px]"
              src={Article.src}
              alt=""
              width={404}
              height={266}
            />

            <p className="text-[21px] leading-[29px] text-[#242424] w-full mr-[19px]">
              {Article.name}
            </p>
            <p className="text-[#777777] text-justify w-full px-[19px] text-sm leading-[21px] mt-[25px]">{Article.caption}</p>
          </div>
        );
      })}
    </div>
  );
}
