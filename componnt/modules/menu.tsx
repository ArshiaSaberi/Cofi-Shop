"use client";
import Image from "next/image";
import { useState } from "react";

export default function HamburgerButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        data-open={open}
        className="
        relative flex items-center justify-center lg:hidden
        w-10 h-10           /* اندازه کلیک بزرگ‌تر */
        cursor-pointer      /* دست موقع هاور */
        transition-all duration-300
        "
      >
        <span
          className=" z-20 
          relative w-6 h-[2px] bg-black transition-all duration-300
          before:content-[''] before:absolute before:left-0 before:w-6 before:h-[2px] before:bg-black before:-translate-y-[8px] before:transition-all before:duration-300
          after:content-[''] after:absolute after:left-0 after:w-6 after:h-[2px] after:bg-black after:translate-y-[8px] after:transition-all after:duration-300

          data-[open=true]:bg-transparent
          data-[open=true]:before:rotate-45 data-[open=true]:before:translate-y-0
          data-[open=true]:after:-rotate-45 data-[open=true]:after:translate-y-0
        "
          data-open={open}
        ></span>
      </button>
      {open ? (
        <>
          <div
            onClick={() => {
              setOpen(false);
            }}
            className="w-screen h-screen fixed top-0 transition-all duration-500 bottom-0 right-0 left-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[6px] z-10 "
          ></div>
          <div className="bg-primry  max-[450px]:min-w-[100%] w-[450px] max-[450px]: max-lg:w-[350px] max-md:w-[250px] h-screen fixed top-0 transition-all duration-300 bottom-0 left-0 z-50 flex items-center justify-start flex-col mb-auto ">
            <div className="hidden items-center justify-between w-full border-b-[1px] border-b-gray-300 p-2 px-[30px] max-[450px]:flex">
            
              <button
                onClick={() => setOpen(!open)}
                data-open={open}
                className="
        relative flex items-center justify-center lg:hidden
        w-10 h-10           /* اندازه کلیک بزرگ‌تر */
        cursor-pointer      /* دست موقع هاور */
        transition-all duration-300
        "
              >
                <span
                  className=" z-20 
          relative w-6 h-[2px] bg-black transition-all duration-300
          before:content-[''] before:absolute before:left-0 before:w-6 before:h-[2px] before:bg-black before:-translate-y-[8px] before:transition-all before:duration-300
          after:content-[''] after:absolute after:left-0 after:w-6 after:h-[2px] after:bg-black after:translate-y-[8px] after:transition-all after:duration-300

          data-[open=true]:bg-transparent
          data-[open=true]:before:rotate-45 data-[open=true]:before:translate-y-0
          data-[open=true]:after:-rotate-45 data-[open=true]:after:translate-y-0
        "
                  data-open={open}
                ></span>
              </button>
              <div className="max-[300px]:hidden">
                <Image
                  className="max-lg:w-[158px] max-md:w-[118px] lg:ml-[35px]"
                  width={191}
                  height={23}
                  src="/fill-font-img-svg-icon/images/Logo.svg.png"
                  alt="logo"
                  quality={100}
                />
              </div>
            </div>
            <div className="border-b-[1px] border-b-gray-300 w-full max-sm:p-[14px] max-sm:px-[14px] max-sm:text-sm max-[450px]:p-[10px] p-6 max-[450px]:px-[17px] px-[30px]  flex items-center justify-between ">
              <input
                className="font-bold outline-none max-[450px]:text-[13px]  placeholder:text-sandstone"
                type="text"
                placeholder="جستوجوی محصولات"
              />
              <div className="">
                <svg className="w-5 h-5 text-black">
                  <use href="#search"></use>
                </svg>
              </div>
            </div>
            <div className="flex justify-between items-center gap-9 flex-col ml-auto px-[30px] mt-[15px]">
              <div>محصولات</div>
              <div>درباره ی ما </div>
              <div>تماس با ما</div>
            </div>
            <div className="w-[156px] h-[42px] mx-3 flex justify-center items-center mt-auto pb-7">
              <div className="ml-3">
                <svg className="w-5 h-5 text-black">
                  <use href="#user"></use>
                </svg>
              </div>
              <div className="text-sm">ورود / ثبت نام</div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            onClick={() => {
              setOpen(false);
            }}
            className="w-[0px] h-screen fixed top-0 transition-all duration-300 bottom-0 right-0 left-0 bg-[rgba(0,0,0,0.7)] max-md:duration-100 backdrop-blur-[6px] z-10"
          ></div>

          <div className="bg-primry z-50 w-[450px] h-screen transition-all duration-300 fixed top-0 bottom-0 left-[-500px] "></div>
        </>
      )}
    </div>
  );
}
