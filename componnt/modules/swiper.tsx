"use client";

import React, { useEffect, useState, useContext } from "react";
import "swiper/css";
import "swiper/css/pagination";
// Swiper modules and styles are not explicitly imported in the provided code
// but are assumed to be handled (e.g., if needed for navigation/pagination)
import { Swiper, SwiperSlide } from "swiper/react";
// Assuming categories comes from this path and has { id, name } structure
import { name as categories } from "../../utils/categori/db";

// Swiper styles
import Image from "next/image";
import { Articles, Articlesi } from "../../utils/Articles/Articles";
import { NewProductContext } from "../../context/NewProductslider";
import SliderNewProdouct from "./slidernewprodouct";
import DiscountProducts from "./Discountproduct";
/**
 * @component NewProductsSlider
 * @description Swiper for category navigation. Already had breakpoints, optimized text scaling.
 */
export function NewProductsSlidertext() {
  const { nameProduct, setnamecontext } = useContext(NewProductContext);
  const [name, setname] = useState("انواع قهوه");

  return (
    <div className="w-full flex flex-wrap items-center justify-center mx-auto px-4 md:px-0 py-4 gap-3">
      {categories.map((item) => {
        const isActive = item.name === name;
        return (
          <React.Fragment key={item.id}>
            <div
              onClick={() => {
                setname(item.name);
                setnamecontext(item.name);
              }}
              className="text-center cursor-pointer select-none"
            >
              <span
                className={`inline-block mx-3 mb-2 border-b-2 transition-all duration-150 m-auto
              text-lg md:text-lg lg:text-xl
              ${
                isActive
                  ? "text-[#333333] border-b-[#B0A27B]"
                  : "text-[#333333B2] border-transparent"
              }`}
              >
                {item.name}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
interface ProductType {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  discountPercent: number;
  finalPrice: number;
  loading?: boolean;
}
/**
 *
 *
 *
 * @component Product
 * @description Swiper for product cards. Added comprehensive breakpoints and responsive image handling.
 */

export function Product() {
  const { nameProduct } = useContext(NewProductContext);
  const [product, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch("/api/prodouct", { cache: "no-store" });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log("❌ Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  const coffeeProducts = product.filter((p) => p.category === nameProduct);
  const skeletons = Array.from({ length: 6 }); // تعداد اسکلتون‌ها برای لودینگ

  const swiperProps = {
    spaceBetween: 0,
    className: "py-5 px-0 sm:px-4",
    breakpoints: {
      320: { slidesPerView: 1.2, spaceBetween: 0 },
      480: { slidesPerView: 1.8, spaceBetween: 20 },
      640: { slidesPerView: 2.5, spaceBetween: 0 },
      768: { slidesPerView: 2.7, spaceBetween: 0 },
      1024: { slidesPerView: 3.2, spaceBetween: 0 },
      1280: { slidesPerView: 3.5, spaceBetween: 0 },
    },
  };

  return (
    <div className="w-full">
      <Swiper {...swiperProps}>
        {loading
          ? skeletons.map((_, i) => (
              <SwiperSlide key={i}>
                <SliderNewProdouct loading />
              </SwiperSlide>
            ))
          : coffeeProducts.map((item) => (
              <SwiperSlide key={item._id}>
                <SliderNewProdouct {...item} />
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}
export function Productdis() {
  const { nameProduct, setnamecontext } = useContext(NewProductContext);
  const araayfake = Array.from({ length: 11 }, (_, i) => i);

  const [product, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    async function getProducts() {
      try {
        const res = await fetch("/api/prodouct", {
          cache: "no-store",
        });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log("❌ Error fetching products:", error);
      }
    }

    getProducts();
  }, []);

  const coffeeProducts = product.filter((p) => p.category === nameProduct);
  const coffeeProductsDiscount = coffeeProducts.filter(
    (p) => p.discountPercent > 0
  );

  return (
    <div className="w-full">
      <Swiper
        // Removed fixed slidesPerView={3.5} to use breakpoints
        spaceBetween={0} // Default minimal space
        className="py-5 px-0 sm:px-4" // Added horizontal padding for the whole slider
        // **Comprehensive Breakpoints Added**
        breakpoints={{
          // Mobile (small viewports)
          320: {
            slidesPerView: 1.2, // Show one and a bit of the next
            spaceBetween: 0,
          },
          // Small devices (e.g., phones in landscape or small tablets)
          480: {
            slidesPerView: 1.8,
            spaceBetween: 20,
          },
          // Tablets (640px+)
          640: {
            slidesPerView: 2.5,
            spaceBetween: 0,
          },
          // Standard Desktops (768px+)
          768: {
            slidesPerView: 2.7,
            spaceBetween: 0,
          },
          // Large Desktops (1024px+)
          1024: {
            slidesPerView: 3.2, // The original desired setting for large screens
            spaceBetween: 0,
          },
          // Extra Large Desktops (1280px+)
          1280: {
            slidesPerView: 3.5,
            spaceBetween: 0,
          },
        }}
      >
        {coffeeProductsDiscount.length
          ? coffeeProductsDiscount.map((item) => (
              <SwiperSlide key={item._id}>
                <DiscountProducts {...item} />
              </SwiperSlide>
            ))
          : araayfake.map((i) => (
              <SwiperSlide key={i}>
                <div className="flex flex-col items-center justify-center px-[15px] mt-4 animate-pulse">
                  {/* تصویر */}
                  <div className="relative w-[302px] h-[302px] rounded-lg overflow-hidden bg-gray-100 mb-4">
                    {/* دایره تخفیف */}
                    <div className="absolute right-[7px] top-[7px] w-[50px] h-[50px] rounded-full bg-gray-200"></div>
                  </div>

                  {/* عنوان */}
                  <div className="h-6 w-40 rounded-md bg-gray-200 mb-[11px]"></div>

                  {/* قیمت‌ها */}
                  <div className="flex items-center justify-center gap-[5px] mb-2">
                    <div className="relative h-6 w-20 rounded-md bg-gray-200 after:content-[''] after:absolute after:h-[1.71px] after:w-full after:bg-gray-300 after:left-0 after:right-0 after:top-1/2"></div>
                    <div className="h-6 w-24 rounded-md bg-gray-200"></div>
                  </div>

                  {/* دکمه */}
                  <div className="h-10 w-full rounded-md bg-gray-200"></div>
                </div>
              </SwiperSlide>
            ))}
      </Swiper>
    </div>
  );
}

export function Articls() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm = 640px
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ حالت موبایل: اسلایدر
  if (isMobile) {
    return (
      <div className="w-full px-4 py-8">
        <Swiper spaceBetween={16} slidesPerView={1.2} grabCursor={true}>
          {Articles.map((Article: Articlesi) => (
            <SwiperSlide key={Article.id}>
              <div className="bg-[#EBEBDC] rounded-[20px] w-[95%] mx-auto  flex flex-col h-[450px] max-[450px]:h-[425px]">
                <Image
                  className="mb-[21px] rounded-[20px]"
                  src={Article.src}
                  alt=""
                  width={404}
                  height={266}
                />
                <p className="text-[21px] max-[517px]:text-base leading-[29px] text-[#242424] w-full mr-[19px] max-[420px]:text-center max-[420px]:mr-0">
                  {Article.name}
                </p>
                <p className="text-[#777777] w-full px-[19px] text-sm leading-[21px] mt-[25px] mb-[30px]">
                  {Article.caption}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  // ✅ حالت دسکتاپ: همون نمایش معمولی کارت‌ها
  return (
    <div className=" flex-wrap justify-between gap-y-[50px] px-4 py-8 hidden">
      {Articles.map((Article) => (
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
          <p className="text-[#777777] w-full px-[19px] text-sm leading-[21px] mt-[25px]">
            {Article.caption}
          </p>
        </div>
      ))}
    </div>
  );
}
