"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filters } from "./Filtering";

export default function Sorting() {
  const [Sorting, setSorting] = useState<string>("");

  const pathname = usePathname(); // مسیر فعلی بدون query
  const searchParams = useSearchParams(); // ReadonlyURLSearchParams
  const queryString = searchParams.toString(); // "flavor=تلخ&Brand=ای اف کافی"

  // تابع ساخت مسیر کامل با query
  const getFullPath = (subPath: string) =>
    queryString ? `${subPath}?${decodeURIComponent(queryString)}` : subPath;

  // وقتی مسیر تغییر کرد، استیت Sorting رو آپدیت کن
  useEffect(() => {
    if (pathname.includes("/products/new")) {
      setSorting("جدید ترین");
    } else if (pathname.includes("/products/old")) {
      setSorting("قدیمی ترین");
    } else if (pathname.includes("/products/Cheapest")) {
      setSorting("ارزان ترین");
    } else if (pathname.includes("/products/expensive")) {
      setSorting("گران ترین");
    } else {
      setSorting(""); // مسیر اصلی یا غیر مرتبط
    }
  }, [pathname]);

  const [isopenitem, setisopenitem] = useState<string>("");
  const [isopenitemcatagory, setisopenitemcatagory] = useState<string>("");
  const [isopenitemflavor, setisopenitemflavor] = useState<string>("");
  const [isopenitemvalueBrand, setisopenitemvalueBrand] = useState<string>("");
  const [valuepricemin, setvaluepricemin] = useState(0);
  const [valuepricemax, setvaluepricemax] = useState(500000);
  const [valueflavor, setvalueflavor] = useState<string>("");
  const [valuecatagory, setvaluecatagory] = useState<string>("");
  const [valueBrand, setvalueBrand] = useState<string>("");
  const router = useRouter();
  const [filterproducts, setfilterproducts] = useState(false);
  const [filtersoting, setfiltersoting] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const minLimit = 0;
  const maxLimit = 500000;
  // موقعیت هندل‌ها به درصد (مقدار اولیه 1000/500000)
  const [minPos, setMinPos] = useState((1000 / maxLimit) * 100);
  const [maxPos, setMaxPos] = useState((500000 / maxLimit) * 100);

  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  // --- منطق Drag برای Range Slider ---
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

  useEffect(() => {
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);

    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging, minPos, maxPos]);
  // ------------------------------------
  const RemoveFilter = () => {
    setIsResetting(true); // پرچم فعال می‌شود
    setvaluepricemin(0);
    setvaluepricemax(500000);
    setvalueflavor("");
    setvaluecatagory("");
    setvalueBrand("");
    setisopenitem("");
    setisopenitemcatagory("");
    setisopenitemflavor("");
    setisopenitemvalueBrand("");
    setMinPos((1000 / maxLimit) * 100);
    setMaxPos((500000 / maxLimit) * 100);

    router.push("/products"); // URL خالی
  };

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Tailwind lg = 1024px
    };

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const applyFilters = () => {
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
      // router.push(pathname + queryad);
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
  };

  useEffect(() => {
    if (!isDesktop) return; // ❌ موبایل و تبلت → اجرا نشود

    if (isResetting) {
      setIsResetting(false);
      return;
    }

    const filters: Filters = {};

    if (valuepricemin !== 0) filters.min = valuepricemin;
    if (valuepricemax !== 500000) filters.max = valuepricemax;
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
    } 
  }, [
    valuepricemin,
    valuepricemax,
    valueflavor,
    valuecatagory,
    valueBrand,
    router,
    isDesktop, // اضافه شد
  ]);

  return (
    <div className="w-full bg-slate-gray max-lg:bg-inherit py-3 rounded-lg flex items-center justify-between relative">
      {/* عنوان */}
      <div className="flex items-center justify-center w-1/6 gap-2 max-lg:hidden">
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
          className="lucide lucide-arrow-down-wide-narrow w-5 h-5 opacity-90"
        >
          <path d="M3 16L7 20L11 16" />
          <path d="M7 20V4" />
          <path d="M11 4H21" />
          <path d="M11 8H18" />
          <path d="M11 12H15" />
        </svg>
        ترتیب نمایش
      </div>

      {/* لینک‌ها */}
      <div
        className="flex items-center justify-evenly w-5/6
                   [&>a:hover]:bg-sandstone [&>a]:py-1 [&>a]:cursor-pointer
                   [&>a]:transition-colors [&>a]:px-3 max-lg:hidden"
      >
        <Link
          className={`${Sorting === "جدید ترین" ? "bg-sandstone" : ""}`}
          onClick={() => setSorting("جدید ترین")}
          href={getFullPath("/products/new")}
        >
          <p>جدید ترین</p>
        </Link>

        <Link
          className={`${Sorting === "قدیمی ترین" ? "bg-sandstone" : ""}`}
          onClick={() => setSorting("قدیمی ترین")}
          href={getFullPath("/products/old")}
        >
          <p>قدیمی ترین</p>
        </Link>

        <Link
          className={`${Sorting === "ارزان ترین" ? "bg-sandstone" : ""}`}
          onClick={() => setSorting("ارزان ترین")}
          href={getFullPath("/products/Cheapest")}
        >
          <p>ارزان ترین</p>
        </Link>

        <Link
          className={`${Sorting === "گران ترین" ? "bg-sandstone" : ""}`}
          onClick={() => setSorting("گران ترین")}
          href={getFullPath("/products/expensive")}
        >
          <p>گران ترین</p>
        </Link>
      </div>

      {/* موبایل  */}

      <div
        className="flex items-center gap-3"
        onClick={() => setfilterproducts(true)}
      >
        <div className="flex items-center gap-2 w-[140px] h-10 justify-center bg-sandstone rounded-lg cursor-pointer lg:hidden max-[400px]:max-w-[110px]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-funnel-icon lucide-funnel"
          >
            <path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" />
          </svg>
          <p>فیلتر ها</p>
        </div>
        <div
          onClick={() => setfiltersoting(true)}
          className="flex items-center gap-2 w-[140px] h-10 justify-center bg-sandstone rounded-lg cursor-pointer lg:hidden max-[400px]:max-w-[110px]"
        >
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
            className="lucide lucide-arrow-down-wide-narrow-icon lucide-arrow-down-wide-narrow w-5 h-5 opacity-90"
          >
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="M11 4h10" />
            <path d="M11 8h7" />
            <path d="M11 12h4" />
          </svg>

          <p>مرتب سازی </p>
        </div>
      </div>
      <div>
        {(filterproducts || filtersoting) && (
          <div
            className="fixed inset-0 transition-all duration-200 bg-black/30 backdrop-blur-md z-50"
            onClick={() => {
              setfilterproducts(false);
              setfiltersoting(false);
            }}
          ></div>
        )}

        <div
          className={`
    fixed left-0 right-0 flex flex-col
    bg-[#e2dfd3] z-50 text-dark-charcoal px-5 py-3 h-[540px] transition-all duration-200
    ${filterproducts ? "bottom-0 " : "bottom-[-650px]"}
  `}
        >
          <div className=" divide-y-1 divide-primry z-50 h-[400px] overflow-y-auto overflow-x-hidden custom-scroll max-[570px]:px-5">
            <div
              className="flex flex-col max-w-[470px] m-auto
              "
            >
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
            <div className="flex flex-col max-w-[470px] m-auto">
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
      ${isopenitemcatagory ? "rotate-180" : ""}
    `}
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </div>

              <div
                className={` flex flex-col gap-5 items-start justify-center
     transition-all duration-200
    ${
      isopenitemcatagory === "catagory"
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
                    className="flex items-center gap-2 cursor-pointer w-full mr-5"
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
                        valuecatagory === "انواع پودریجات"
                          ? ""
                          : "انواع پودریجات"
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
            <div className="flex flex-col max-w-[470px] m-auto">
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
            <div className="flex flex-col max-w-[470px] m-auto">
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
                      setvalueflavor(
                        valueflavor === "کاراملی" ? "" : "کاراملی"
                      );
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
          <div className="flex items-center justify-center max-w-[470px] m-auto gap-3 w-full max-[350px]:text-xs">
            <div
              onClick={() => {
                applyFilters();
                setfilterproducts(false);
              }}
              className="flex items-center justify-center border border-chocolate-dark rounded-lg text-white bg-sandstone w-full h-10 gap-2 cursor-pointer "
            >
              اعمال فیلتر ها
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
                // توجه: کلاس‌های Tailwind مانند !w-5 و bg-primary رنگ و اندازه آن را تعیین می‌کنند
                className="lucide lucide-check-icon lucide-check !w-5 !h-5 min-w-5 min-h-5 bg-primary p-1 rounded-md stroke-card stroke-3"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <div
              onClick={() => {
                RemoveFilter();
                setfilterproducts(false);
              }}
              className="flex items-center justify-center border border-chocolate-dark rounded-lg  w-full h-10 gap-2 hover:text-white hover:bg-sandstone cursor-pointer transition-all duration-200 max-[350px]:text-xs"
            >
              حذف همه فیلتر ها
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
                className="lucide lucide-x-icon lucide-x w-4"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6L18 18" />
              </svg>
            </div>
          </div>
        </div>

        {/* لینک */}
        <div
          className={`
    fixed left-0 right-0 flex flex-col items-center justify-center
    bg-[#e2dfd3] z-50 text-dark-charcoal px-5 py-3 h-[540px] transition-all duration-200
    ${filtersoting ? "bottom-0 " : "bottom-[-650px]"}
  `}
        >
          <div
            className="flex items-start justify-center w-5/6
                   [&>a:hover]:bg-sandstone [&>a]:py-1 [&>a]:cursor-pointer
                   [&>a]:transition-colors [&>a]:px-3 h-[70%] gap-3 flex-col "
          >
            <Link
              className={`h-[20%] flex items-center justify-between w-full ${
                Sorting === "جدید ترین" ? "bg-sandstone " : ""
              }`}
              onClick={() => {
                setfiltersoting(false);
                setfilterproducts(false);
                setSorting("جدید ترین");
              }}
              href={getFullPath("/products/new")}
            >
              <p>جدید ترین</p>
              {Sorting === "جدید ترین" && (
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
                  className="lucide lucide-check-icon lucide-check"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              )}
            </Link>

            <Link
              className={`h-[20%] flex items-center justify-between w-full ${
                Sorting === "قدیمی ترین" ? "bg-sandstone " : ""
              }`}
              onClick={() => {
                setfilterproducts(false);
                setfiltersoting(false);
                setSorting("قدیمی ترین");
              }}
              href={getFullPath("/products/old")}
            >
              <p>قدیمی ترین</p>
              {Sorting === "قدیمی ترین" && (
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
                  className="lucide lucide-check-icon lucide-check"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              )}
            </Link>

            <Link
              className={`h-[20%] flex items-center justify-between w-full ${
                Sorting === "ارزان ترین" ? "bg-sandstone" : ""
              }`}
              onClick={() => {
                setfilterproducts(false);
                setfiltersoting(false);
                setSorting("ارزان ترین");
              }}
              href={getFullPath("/products/Cheapest")}
            >
              <p>ارزان ترین</p>
              {Sorting === "ارزان ترین" && (
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
                  className="lucide lucide-check-icon lucide-check"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              )}
            </Link>

            <Link
              className={`h-[20%] flex items-center justify-between w-full ${
                Sorting === "گران ترین" ? "bg-sandstone" : ""
              }`}
              onClick={() => {
                setfilterproducts(false);
                setfiltersoting(false);
                setSorting("گران ترین");
              }}
              href={getFullPath("/products/expensive")}
            >
              <p>گران ترین</p>
              {Sorting === "گران ترین" && (
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
                  className="lucide lucide-check-icon lucide-check"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
              )}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
