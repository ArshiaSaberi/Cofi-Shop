"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
export interface Filters {
  min?: number;
  max?: number;
  flavor?: string;
  catagory?: string;
  Brand?: string;
}
export default function Filtering() {
  const [isopenitem, setisopenitem] = useState<string>("");
  const [isopenitemcatagory, setisopenitemcatagory] = useState<string>("");
  const [isopenitemflavor, setisopenitemflavor] = useState<string>("");
  const [isopenitemvalueBrand, setisopenitemvalueBrand] = useState<string>("");
  const [valuepricemin, setvaluepricemin] = useState(0);
  const [valuepricemax, setvaluepricemax] = useState(500000);
  const [valueflavor, setvalueflavor] = useState<string>("");
  const [valuecatagory, setvaluecatagory] = useState<string>("");
  const [valueBrand, setvalueBrand] = useState<string>("");
  const pathname = usePathname(); // گرفتن مسیر جاری
  const searchParams = useSearchParams();
  const [link, setlink] = useState("");

  const router = useRouter();

  const [isResetting, setIsResetting] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchParams.get("catagory") === "انواع قهوه") {
      setlink("انواع قهوه");
      setvaluecatagory("انواع قهوه");
      router.push(
        "/products/%20?catagory=%D8%A7%D9%86%D9%88%D8%A7%D8%B9+%D9%82%D9%87%D9%88%D9%87"
      );
      setisopenitemcatagory("catagory")
    }
    if (searchParams.get("catagory") === "انواع پودریجات") {
      setlink("انواع پودریجات");

      setvaluecatagory("انواع پودریجات");
      router.push(
        "/products/%20?catagory=%D8%A7%D9%86%D9%88%D8%A7%D8%B9+%D9%BE%D9%88%D8%AF%D8%B1%DB%8C%D8%AC%D8%A7%D8%AA"
      );
      setisopenitemcatagory("catagory")
    }
    if (searchParams.get("catagory") === "دریپ بک") {
      setlink("دریپ بک");

      setvaluecatagory("دریپ بک");
      router.push(
        "/products/%20?catagory=%D8%AF%D8%B1%DB%8C%D9%BE+%D8%A8%DA%A9"
      );
      setisopenitemcatagory("catagory")
    }
    if (searchParams.get("catagory") === "سیروپ ها") {
      setlink("سیروپ ها");

      setvaluecatagory("سیروپ ها");
      router.push(
        "/products/%20?catagory=%D8%B3%DB%8C%D8%B1%D9%88%D9%BE+%D9%87%D8%A7"
      );
      setisopenitemcatagory("catagory")
    }
    if (searchParams.get("catagory") === "انواع اکسسوری") {
      setlink("انواع اکسسوری");

      setvaluecatagory("انواع اکسسوری");
      router.push(
        "/products/%20?catagory=%D8%A7%D9%86%D9%88%D8%A7%D8%B9+%D8%A7%DA%A9%D8%B3%D8%B3%D9%88%D8%B1%DB%8C"
      );
      setisopenitemcatagory("catagory")
    }

  }, []);

  const minLimit = 0;
  const maxLimit = 500000;

  // موقعیت هندل‌ها به درصد
  const [minPos, setMinPos] = useState((1000 / maxLimit) * 100);
  const [maxPos, setMaxPos] = useState((500000 / maxLimit) * 100);

  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const startDrag =
    (handle: "min" | "max") => (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(handle);
    };

  const stopDrag = () => setDragging(null);

  const onDrag = (e: MouseEvent) => {
    if (!dragging || !trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    let pos = ((e.clientX - trackRect.left) / trackRect.width) * 100;

    if (dragging === "min") {
      pos = Math.min(pos, maxPos);
      pos = Math.max(pos, 0);
      setMinPos(pos);
      setvaluepricemin(
        Math.round((pos / 100) * (maxLimit - minLimit) + minLimit)
      );
    } else if (dragging === "max") {
      pos = Math.max(pos, minPos);
      pos = Math.min(pos, 100);
      setMaxPos(pos);
      setvaluepricemax(
        Math.round((pos / 100) * (maxLimit - minLimit) + minLimit)
      );
    }
  };
  const RemoveFilter = () => {
    setIsResetting(true); // پرچم فعال می‌شود
    setvaluepricemin(0);
    setvaluepricemax(500000);
    setvalueflavor("");
    setvalueBrand("");
    setvaluecatagory("");
    setisopenitem("");
    setisopenitemcatagory("");
    setisopenitemflavor("");
    setisopenitemvalueBrand("");
    setMinPos((1000 / maxLimit) * 100);
    setMaxPos((500000 / maxLimit) * 100);

    router.push("/products"); // URL خالی
  };
  useEffect(() => {
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
    return () => {
      window.removeEventListener("mousemove", onDrag);
      window.removeEventListener("mouseup", stopDrag);
    };
  });

  useEffect(() => {
    if (isResetting) {
      setIsResetting(false);
      return;
    }

    const filters: Filters = {};

    if (valuepricemin !== 0) filters.min = valuepricemin; // فقط اگر کاربر تغییر داده
    if (valuepricemax !== 500000) filters.max = valuepricemax; // فقط اگر کاربر تغییر داده
    if (valueflavor) filters.flavor = valueflavor;
    if (valuecatagory) filters.catagory = valuecatagory;
    if (valueBrand) filters.Brand = valueBrand;

    const queryad = new URLSearchParams(
      Object.entries(filters).map(([k, v]) => [k, String(v)])
    ).toString();

    if (pathname.startsWith("/products/new")) {
      router.push(`/products/new?${queryad}`);
    } else if (pathname.startsWith("/products/old")) {
      router.push(`/products/old?${queryad}`);
    } else if (pathname.startsWith("/products/Cheapest")) {
      router.push(`/products/Cheapest?${queryad}`);
    } else if (pathname.startsWith("/products/expensive")) {
      router.push(`/products/expensive?${queryad}`);
    } else {
      router.push(queryad ? `/products/ ?${queryad}` : `${pathname}`);
    }
  }, [
    valuepricemin,
    valuepricemax,
    valueflavor,
    valuecatagory,
    valueBrand,
    router,
  ]);

  return (
    <div className="flex flex-col bg-slate-gray rounded-lg w-1/4 p-5 h-[100vw] max-lg:hidden">
      <div className="flex items-center justify-between max-xl:flex-col max-xl:gap-2 ">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2} // camelCase
            strokeLinecap="round" // camelCase
            strokeLinejoin="round" // camelCase
            className="w-5 h-5"
          >
            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
          </svg>
          <p>فیلتر ها</p>
        </div>
        <div
          className="flex items-center gap-2 border border-primry max-lg:p-1 p-2  justify-center cursor-pointer"
          onClick={() => RemoveFilter()}
        >
          <p className="text-xs">پاک کردن فیلتر ها</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-x-icon lucide-x w-3 h-3 stroke-body"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </div>
      </div>
      <div className="mt-5 divide-y-1 divide-primry">
        <div className="flex flex-col">
          <div
            onClick={() => {
              setisopenitem(isopenitem === "price" ? "" : "price");
            }}
            className="flex py-5 items-center h-[67px] justify-between cursor-pointer "
          >
            محدوده قیمت
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 shrink-0 transition-transform duration-200 
      ${isopenitem ? "rotate-180" : ""}
    `}
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>

          <div
            className={` flex flex-col gap-5 items-center justify-center
     transition-all duration-200
    ${
      isopenitem === "price"
        ? "max-h-[400px] overflow-visible py-5 opacity-100"
        : "max-h-0 overflow-hidden opacity-0"
    }
  `}
          >
            <div className="flex items-center justify-between w-full gap-3">
              <p>از</p>
              <input
                type="number"
                className="outline-1 outline-sand-beige  py-2 max-lg:max-w-[110px] flex items-center justify-center text-center  max-xl:max-w-[140px]"
                value={valuepricemin}
                onChange={(e) => setvaluepricemin(Number(e.target.value))}
              />
              <p>تومان</p>
            </div>
            <div className="w-full">
              <div className="relative w-full h-8">
                {/* خط اصلی */}
                <div
                  ref={trackRef}
                  className="absolute top-1/2 -translate-y-1/2 w-full h-[6px] bg-gray-300 rounded-full"
                />

                {/* قسمت رنگی بین دو هندل */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-[6px] bg-sandstone rounded-full"
                  style={{
                    left: `${minPos}%`,
                    width: `${maxPos - minPos}%`,
                  }}
                />

                {/* هندل چپ (حداقل) */}
                <div
                  onMouseDown={startDrag("min")}
                  className="w-6 h-6 bg-primry border-2 border-chocolate-dark rounded-full absolute top-1/2 -translate-y-1/2 cursor-pointer shadow-md"
                  style={{ left: `calc(${minPos}% - 12px)` }}
                />

                {/* هندل راست (حداکثر) */}
                <div
                  onMouseDown={startDrag("max")}
                  className="w-6 h-6 bg-primry border-2 border-chocolate-dark rounded-full absolute top-1/2 -translate-y-1/2 cursor-pointer shadow-md"
                  style={{ left: `calc(${maxPos}% - 12px)` }}
                />
              </div>
            </div>
            <div className="flex items-center justify-between w-full gap-3">
              <p>تا</p>
              <input
                type="number"
                className="outline-1 outline-sand-beige  py-2 max-lg:max-w-[110px] flex items-center justify-center text-center max-xl:max-w-[140px]"
                value={valuepricemax}
                onChange={(e) => setvaluepricemax(Number(e.target.value))}
              />
              <p>تومان</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col ">
          <div
            onClick={() => {
              setisopenitemcatagory(
                isopenitemcatagory === "catagory" ? "" : "catagory"
              );
            }}
            className="flex py-5 items-center h-[67px] justify-between cursor-pointer "
          >
            دسته بندی ها
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 shrink-0 transition-transform duration-200 
      ${isopenitemcatagory  ? "rotate-180" : ""}
    `}
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>

          <div
            className={` flex flex-col gap-5 items-start justify-center
     transition-all duration-200
    ${
      isopenitemcatagory  === "catagory" 
        ? "max-h-[300px] overflow-visible pb-5"
        : "max-h-0 overflow-hidden"
    }
  `}
          >
            <div className="flex flex-col items-start justify-center gap-3 w-full">
              <p
                className={`bg-sand-beige cursor-pointer flex w-full m-auto mb-3 text-center items-center justify-center rounded-lg ${
                  valuecatagory ? "p-2 " : "hidden"
                }`}
                onClick={() => setvaluecatagory("")}
              >
                X {valuecatagory}
              </p>

              <div
                className="flex  items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvaluecatagory(
                    valuecatagory === "انواع قهوه" ? "" : "انواع قهوه"
                  );
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valuecatagory === "انواع قهوه" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>انواع قهوه</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvaluecatagory(
                    valuecatagory === "انواع پودریجات" ? "" : "انواع پودریجات"
                  );
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valuecatagory === "انواع پودریجات" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>انواع پودریجات</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvaluecatagory(
                    valuecatagory === "دریپ بک" ? "" : "دریپ بک"
                  );
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valuecatagory === "دریپ بک" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>دریپ بک</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvaluecatagory(
                    valuecatagory === "سیروپ ها" ? "" : "سیروپ ها"
                  );
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valuecatagory === "سیروپ ها" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>سیروپ ها</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvaluecatagory(
                    valuecatagory === "انواع اکسسوری" ? "" : "انواع اکسسوری"
                  );
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valuecatagory === "انواع اکسسوری" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>انواع اکسسوری</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div
            onClick={() => {
              setisopenitemvalueBrand(
                isopenitemvalueBrand === "Brand" ? "" : "Brand"
              );
            }}
            className="flex py-5 items-center h-[67px] justify-between cursor-pointer "
          >
            برند ها
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 shrink-0 transition-transform duration-200 
      ${isopenitemvalueBrand ? "rotate-180" : ""}
    `}
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>

          <div
            className={` flex flex-col gap-5 items-start justify-center
     transition-all duration-200
    ${
      isopenitemvalueBrand === "Brand"
        ? "max-h-[300px] overflow-visible pb-5"
        : "max-h-0 overflow-hidden"
    }
  `}
          >
            <p
              className={`bg-sand-beige cursor-pointer flex w-full m-auto mb-3 text-center items-center justify-center rounded-lg ${
                valueBrand ? "p-2 " : "hidden"
              }`}
              onClick={() => setvalueBrand("")}
            >
              X {valueBrand}
            </p>

            <div className="flex flex-col items-start justify-center gap-3 w-full">
              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvalueBrand(
                    valueBrand === "ای اف کافی" ? "" : "ای اف کافی"
                  );
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valueBrand === "ای اف کافی" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>ای اف کافی</p>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvalueBrand(valueBrand === "بن مانو" ? "" : "بن مانو");
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valueBrand === "بن مانو" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>بن مانو</p>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvalueBrand(valueBrand === "دونیسی" ? "" : "دونیسی");
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valueBrand === "دونیسی" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>دونیسی</p>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvalueBrand(valueBrand === "ریو" ? "" : "ریو");
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valueBrand === "ریو" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>ریو</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div
            onClick={() => {
              setisopenitemflavor(
                isopenitemflavor === "flavor" ? "" : "flavor"
              );
            }}
            className="flex py-5 items-center h-[67px] justify-between cursor-pointer "
          >
            طمع ها
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-4 w-4 shrink-0 transition-transform duration-200 
      ${isopenitemflavor ? "rotate-180" : ""}
    `}
            >
              <path d="m6 9 6 6 6-6"></path>
            </svg>
          </div>

          <div
            className={` flex flex-col gap-5 items-start justify-center
     transition-all duration-200
    ${
      isopenitemflavor === "flavor"
        ? "max-h-[300px] overflow-visible pb-5"
        : "max-h-0 overflow-hidden"
    }
  `}
          >
            <p
              className={`bg-sand-beige cursor-pointer flex w-full m-auto mb-3 text-center items-center justify-center rounded-lg ${
                valueflavor ? "p-2 " : "hidden"
              }`}
              onClick={() => setvalueflavor("")}
            >
              X {valueflavor}
            </p>

            <div className="flex flex-col items-start justify-center gap-3 w-full ">
              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvalueflavor(valueflavor === "تلخ" ? "" : "تلخ");
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valueflavor === "تلخ" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>تلخ</p>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvalueflavor(valueflavor === "شیرین" ? "" : "شیرین");
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valueflavor === "شیرین" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>شیرین</p>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvalueflavor(valueflavor === "ترش" ? "" : "ترش");
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valueflavor === "ترش" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>ترش</p>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvalueflavor(valueflavor === "کاراملی" ? "" : "کاراملی");
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valueflavor === "کاراملی" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>کاراملی</p>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer w-full mr-5"
                onClick={(e) => {
                  setvalueflavor(
                    valueflavor === "فلفل سیاه" ? "" : "فلفل سیاه"
                  );
                }}
              >
                <div>
                  <span
                    className={`w-5 h-5 bg-sand-beige rounded-lg flex items-center justify-center`}
                  >
                    {valueflavor === "فلفل سیاه" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
                      >
                        <path d="M20 6 9 17l-5-5"></path>
                      </svg>
                    )}
                  </span>
                </div>
                <p>فلفل سیاه</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
