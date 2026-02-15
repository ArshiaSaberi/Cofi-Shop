import Image from "next/image";
import React from "react";
import { Category } from "../../utils/categori/db";
import Link from "next/link";

export default function Categorization(props: Category) {
  return (
    <Link href={props.link}>
    <div className="flex items-center justify-center max-[579px]:justify-between  bg-[#E2DFD5] w-[220px] lg:h-[87px] h-[72px] rounded-[800px] m-[11px] font-bold max-[579px]:min-w-full px-[16px]">
      <div className="flex items-center justify-center cursor-pointer">
        <div>
          <Image
            className="rounded-full"
            src={props.src}
            alt=""
            width={50}
            height={50}
            quality={100}
          />
        </div>
        <p className="text-dark-charcoal leading-[42px] max-sm:text-xl lg:text-3xl text-[24px] mr-[14px]">
          {props.name}
        </p>
      </div>
      <svg className="w-[30px] h-[30px] min-[579px]:hidden">
        <use href="#aroo-left"></use>
      </svg>
    </div>
    </Link>

  );
}
