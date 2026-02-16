"use client";
import { useEffect, useState } from "react";
import DiscountProductsfiltring from "../../../../componnt/modules/DiscountProductsfiltring";
import { useSearchParams } from "next/navigation";

interface ProductType {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
 images: string[];  discountPercent: number;
  finalPrice: number;
  updatedAt: string;
  createdAt: string;
  flavor: string;
  brand: string;
}

export default function ExpensiveProducts() {
  const [Products, setProducts] = useState<ProductType[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [columns, setColumns] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [isres, setIsres] = useState(false);
  const searchParams = useSearchParams();

  // ---------- ریسایز برای گرید داینامیک ----------
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      let cols = 3;
      if (width < 400) cols = 1;
      else if (width < 650) cols = 2;
      else if (width < 900) cols = 3;
      else if (width < 1024) cols = 4;
      else cols = 4;

      let perPage = 6;
      if (cols === 4) perPage = 8;
      else if (cols === 3) perPage = 12;
      else if (cols === 2) perPage = 6;
      else if (cols === 1) perPage = 4;

      setColumns(cols);
      setItemsPerPage(perPage);
      setCurrentPage(1);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------- دریافت و فیلتر محصولات ----------
  useEffect(() => {
    async function getProducts() {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/api/prodouct", {
          cache: "no-store",
        });
        const data: ProductType[] = await res.json();
        let filteredProducts = [...data];

        const minParam = searchParams.get("min");
        const maxParam = searchParams.get("max");
        const flavorParam = searchParams.get("flavor");
        const catParam = searchParams.get("catagory");
        const brandParam = searchParams.get("Brand");

        const min =
          minParam && !isNaN(Number(minParam)) ? Number(minParam) : undefined;
        const max =
          maxParam && !isNaN(Number(maxParam)) ? Number(maxParam) : undefined;
        const flavor =
          flavorParam && flavorParam.trim() !== "" ? flavorParam : undefined;
        const category =
          catParam && catParam.trim() !== "" ? catParam : undefined;
        const brand =
          brandParam && brandParam.trim() !== "" ? brandParam : undefined;

        // فیلتر قیمت
        if (min !== undefined && max !== undefined) {
          filteredProducts = filteredProducts.filter(
            (item) =>
              typeof item.finalPrice === "number" &&
              item.finalPrice >= min &&
              item.finalPrice <= max
          );
        } else if (min !== undefined) {
          filteredProducts = filteredProducts.filter(
            (item) => typeof item.finalPrice === "number" && item.finalPrice >= min
          );
        } else if (max !== undefined) {
          filteredProducts = filteredProducts.filter(
            (item) => typeof item.finalPrice === "number" && item.finalPrice <= max
          );
        }

        // فیلتر طعم، دسته‌بندی، برند
        if (flavor) filteredProducts = filteredProducts.filter((item) => item.flavor === flavor);
        if (category) filteredProducts = filteredProducts.filter((item) => item.category === category);
        if (brand) filteredProducts = filteredProducts.filter((item) => item.brand === brand);

        // مرتب‌سازی از گران‌ترین
        filteredProducts.sort((a, b) => b.finalPrice - a.finalPrice);

        setProducts(filteredProducts);
        setIsres(true);
        setCurrentPage(1);
      } catch (error) {
        console.log("❌ Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getProducts();
  }, [searchParams]);

  // ---------- صفحه‌بندی ----------
  const totalPages = Math.ceil(Products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = Products.slice(indexOfFirstItem, indexOfLastItem);
  const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // ---------- کلاس گرید داینامیک ----------
  const gridClass = `grid gap-5 grid-cols-4 mt-10 grid-cols-${columns} ${
    columns === 1 ? "max-[400px]:grid-cols-1" : ""
  } ${columns === 2 ? "max-[650px]:grid-cols-2" : ""} ${
    columns === 3 ? "max-[900px]:grid-cols-3" : ""
  } ${columns === 4 ? "max-[1024px]:grid-cols-4" : ""}`;

  return (
    <div className="mt-10 flex items-center justify-center flex-col">
      {isLoading ? (
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
        <div className={gridClass}>
          {currentProducts.map((item) => (
            <DiscountProductsfiltring key={item._id} {...item} />
          ))}
        </div>
      ) : isres ? (
        <div className="text-black text-2xl mt-[100px] text-center">
          محصول مورد نظر پیدا نشد
        </div>
      ) : null}

      {/* صفحه‌بندی */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center mt-10 flex-wrap gap-3">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#BBBBBB] text-black rounded cursor-pointer disabled:bg-gray-400 disabled:text-gray-700"
          >
            قبلی
          </button>

          {pageButtons.map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded cursor-pointer ${
                currentPage === page ? "bg-chocolate-dark text-white" : "bg-sand-beige"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-[#BBBBBB] text-black rounded cursor-pointer disabled:bg-gray-400 disabled:text-gray-700"
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
}
