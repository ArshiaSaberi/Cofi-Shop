"use client";
import React, { useState } from "react";
import { name as categories } from "../../utils/categori/db";

export default function NewProducts() {
  const [activeId, setActiveId] = useState(1);
  return (
    <>
      {categories.map((item) => {
        const isClicked = item.id === activeId;

        return (
          <div
            className={`
                    text-2xl 
                    mx-[25px] 
                    mb-[25px] 
                    cursor-pointer 
                    ${
                      isClicked
                        ? "text-[#333333] leading-normal border-b-2 border-b-[#B0A27B] pb-[2px]"
                        : "text-[#333333B2]"
                    }
                `}
            key={item.id}
            onClick={() => setActiveId(item.id)}
          >
            {item.name}
          </div>
        );
      })}
    </>
  );
}
