"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import DiscountProductsfiltring from "../../../../componnt/modules/DiscountProductsfiltring";

interface FiltersProduct {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  images: string[];
  discountPercent: number;
  finalPrice: number;
  updatedAt: Date;
  createdAt: Date;
  flavor: string;
  brand: string;
}

export default function Filtering() {
  const [Products, setProducts] = useState<FiltersProduct[]>([]);
  const [isload, setIsload] = useState(true);
  const [columns, setColumns] = useState(3);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();

  // 📌 محاسبه مقادیر فیلتر فقط وقتی searchParams تغییر کنند
  const { min, max, flavorproduct, catagoryproduct, Brandproduct } =
    useMemo(() => {
      return {
        min: Number(searchParams.get("min")) || 0,
        max: Number(searchParams.get("max")) || 500000,
        flavorproduct: searchParams.get("flavor") || "",
        catagoryproduct: searchParams.get("catagory") || "",
        Brandproduct: searchParams.get("Brand") || "",
      };
    }, [searchParams.toString()]); // تغییر searchParams فقط وقتی trigger شود که query واقعی تغییر کند

  // 📌 گرفتن محصولات + فیلتر
  useEffect(() => {
    async function getProducts() {
      setIsload(true);
      try {
        const res = await fetch("/api/prodouct", {
          cache: "no-store",
        });
        const data: FiltersProduct[] = await res.json();
        let filtered = data.filter(
          (item) => item.finalPrice >= min && item.finalPrice <= max
        );

        if (flavorproduct)
          filtered = filtered.filter((item) => item.flavor === flavorproduct);
        if (catagoryproduct)
          filtered = filtered.filter(
            (item) => item.category === catagoryproduct
          );
        if (Brandproduct)
          filtered = filtered.filter((item) => item.brand === Brandproduct);

        setProducts(filtered);
        setCurrentPage(1);
      } catch (error) {
        console.log(error);
        setProducts([]);
      } finally {
        setIsload(false);
      }
    }

    getProducts();
  }, [min, max, flavorproduct, catagoryproduct, Brandproduct]); // useEffect فقط وقتی اجرا می‌شود که مقادیر فیلتر واقعی تغییر کنند

  // 📌 رسپانسیو: تعداد ستون + تعداد آیتم
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      let cols = 4;
      let perPage = 12;

      if (width < 400) {
        cols = 1;
        perPage = 4;
      } else if (width < 650) {
        cols = 2;
        perPage = 6;
      } else if (width < 900) {
        cols = 3;
        perPage = 12;
      } else if (width < 1024) {
        cols = 4;
        perPage = 8;
      } else {
        cols = 4;
        perPage = 8;
      }

      setColumns(cols);
      setItemsPerPage(perPage);
      setCurrentPage(1);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 📌 صفحه بندی
  const totalPages = Math.ceil(Products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = Products.slice(indexOfFirstItem, indexOfLastItem);
  const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className=" flex items-center justify-center flex-col w-full">
      {isload ? (
        <div
          className="w-12 h-12 mt-[100px] rounded-full animate-spin"
          style={{
            background: `
            radial-gradient(farthest-side, #766DF4 94%, transparent) top/8px 8px no-repeat,
            conic-gradient(transparent 30%, #766DF4)
          `,
            WebkitMask:
              "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0)",
          }}
        ></div>
      ) : currentProducts.length > 0 ? (
        <div
          className={`w-full grid gap-5 mt-10
  max-[400px]:grid-cols-1
  max-[650px]:grid-cols-2
  grid-cols-3
  md:grid-cols-4
  lg:grid-cols-4`}
        >
          {currentProducts.map((item) => (
            <DiscountProductsfiltring key={item._id} {...item} />
          ))}
        </div>
      ) : (
        <div className="text-black text-2xl mt-[100px] text-center flex flex-col items-center justify-center">
          محصول مورد نظر پیدا نشد
        </div>
      )}

      {!isload && totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 flex-wrap gap-3">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 bg-[#BBBBBB] text-black rounded disabled:opacity-40 ${
              currentPage === 1 ? "" : "cursor-pointer"
            }`}
            disabled={currentPage === 1}
          >
            قبلی
          </button>

          {pageButtons.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-chocolate-dark text-white scale-105 "
                  : "bg-sand-beige"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            className={`px-4 py-2 bg-[#BBBBBB] text-black rounded disabled:opacity-40 ${
              currentPage === totalPages ? "" : "cursor-pointer"
            }`}
            disabled={currentPage === totalPages}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
