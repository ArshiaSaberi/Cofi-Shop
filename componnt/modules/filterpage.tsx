"use client";
import { useEffect, useState } from "react";
import DiscountProductsfiltring from "./DiscountProductsfiltring";

interface ProductType {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
  discountPercent: number;
  finalPrice: number;
  updatedAt: Date;
  createdAt: Date;
}

export function FilterProductPage() {
  const [Products, setProducts] = useState<ProductType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isResizingLoading, setIsResizingLoading] = useState<boolean>(false);

  // تغییر تعداد نمایش بر اساس عرض صفحه
  useEffect(() => {
    function handleResize() {

      const width = window.innerWidth;
      if (width < 1024) {
        setItemsPerPage(8);
      } else {
        setItemsPerPage(8);
      }

      setCurrentPage(1);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // دریافت محصولات از API
  useEffect(() => {
    async function getProducts() {
      try {
        setIsLoading(true);

        const res = await fetch("/api/prodouct", {
          cache: "no-store",
        });
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.log("❌ Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getProducts();
  }, []);

  const totalPages = Math.ceil(Products.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = Products.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  const handlePrevPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);

  const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  const showLoader = isLoading || isResizingLoading;

useEffect(() => {
  function handleResize() {
    const width = window.innerWidth;
    let columns = 3; // حالت پیش‌فرض

    if (width < 400) columns = 1;
    else if (width < 650) columns = 2;
    else if (width < 1024) columns = 3;
    else if (width >= 1024) columns = 4;

    let perPage = 6; // مقدار پیش‌فرض
    if (columns === 4) perPage = 8;
    else if (columns === 3) perPage = 12;
    else if (columns === 2) perPage = 6;
    else if (columns === 1) perPage = 4;

    setItemsPerPage(perPage);
    setCurrentPage(1);
  }

  handleResize();
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

  

  return (
    <div className="mt-10">
      {showLoader ? (
        <div
          className="w-12 h-12 mt-[100px] rounded-full animate-spin mx-auto"
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
       <div className="
  grid gap-5 mt-10
  max-[400px]:grid-cols-1
  max-[650px]:grid-cols-2
  grid-cols-3
  md:grid-cols-4
  lg:grid-cols-4
">
  {currentProducts.map(item => (
    <DiscountProductsfiltring key={item._id} {...item} />
  ))}
</div>

      ) : (
        <p className="text-center mt-20 text-xl text-gray-700">
          محصولی یافت نشد
        </p>
      )}

      {/* صفحه‌بندی */}
       {!showLoader && totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 flex-wrap gap-3">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className={`px-4 py-2 bg-[#BBBBBB] text-black rounded disabled:opacity-40 ${currentPage === 1 ? "" : "cursor-pointer"}`}
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
            className={`px-4 py-2 bg-[#BBBBBB] text-black rounded disabled:opacity-40 ${currentPage === totalPages ? "" : "cursor-pointer"}`}
            disabled={currentPage === totalPages}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
