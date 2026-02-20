"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { IUser } from "@MOLDS/users";
import { deleteUserAction } from "@utils/authActions/auth";
import { deleteCookie, getCookie } from "@utils/getcookie";
import { useRouter } from "next/navigation";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

export interface ProductType {
  _id: string;
  title: string;
  category: string;
  price: number;
  description: string;
  images: string;
  discountPercent: number;
  count: number;
  finalPrice: number;
  brand?: string;
  flavor?: string;
  coffeeBlend?: {
    arabica?: string;
    robusta?: string;
  };
}
interface popularsearch {
  _id: string;
  term: string;
  count: number;
  updatedAt: Date;
}
interface CartItem {
  product: string;
  quantity: number;
  price: number;
  finalPrice: number;
  _id: string;
  id: string;
}

interface CartType {
  _id: string;
  user: string;
  items: CartItem[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalPrice: number;
  totalQuantity: number;
  id: string;
}

interface GetCartsResponse {
  carts: CartType[];
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [opensearch, setOpensearch] = useState(false);
  const [searchvalue, setsearchvalue] = useState("");
  const [opensearchmobile, setOpensearchmobile] = useState(false);
  const [load, setload] = useState(false);
  const [isclickremoveme, setisclickremoveme] = useState(false);
  const [showmodaluser, setshowmodaluser] = useState(false);
  const [searchvaluemobile, setsearchvaluemobile] = useState("");
  const [includessearch, setincludessearch] = useState<ProductType[]>([]);
  const [datacart, setdatacart] = useState<CartType[]>([]);

  const [datafetchsearchproduct, setdatasearchproduct] = useState<
    ProductType[]
  >([]);
  const [popular, setpopular] = useState<popularsearch[]>([]);
  const [user, setuser] = useState<IUser | null>();
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();
  const token = getCookie("token");

  const { data: cartData,refetch } =
          useQuery<GetCartsResponse>({
            queryKey: ["cart"],
            queryFn: async () => {
              const res = await fetch("/api/cart");
              if (!res.ok) return { carts: [] };
              return res.json();
            },
          });

          setdatacart(cartData?.carts)

  useEffect(() => {
   

    refetch();

    const handleCartUpdate = () => refetch();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [token]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
      setOpensearch(false);
    };

    const fetchDatasearch = async () => {
      try {
        const res = await fetch("/api/prodouct", {
          cache: "no-store",
        });
        const data = await res.json();
        setdatasearchproduct(data);
      } catch (error) {
        console.log("❌ Error fetching products:", error);
      }
    };
    fetchDatasearch();

    const fetchDatapopular = async () => {
      try {
        const res = await fetch("/api/search/popular-searches", {
          cache: "no-store",
        });
        const data = await res.json();
        setpopular(data.popular);
      } catch (error) {
        console.log("❌ Error fetching products:", error);
      }
    };
    fetchDatapopular();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchvaluemobile.length > 2) {
      const finde = datafetchsearchproduct.filter((item) => {
        return item.title
          .toLowerCase()
          .includes(searchvaluemobile.toLowerCase());
      });
      setload(true);

      setincludessearch(finde);
    } else {
      setload(false);
      setincludessearch([]);
    }
  }, [searchvaluemobile]);

  useEffect(() => {
    if (searchvalue.length > 2) {
      const findedes = datafetchsearchproduct.filter((item) => {
        return item.title.toLowerCase().includes(searchvalue.toLowerCase());
      });
      setload(true);

      setincludessearch(findedes);
    } else {
      setload(false);

      setincludessearch([]);
    }
  }, [searchvalue]);

  const removeme = async () => {
    setuser(null);
    const token = getCookie("token"); // توکن رو از کوکی می‌گیریم
    if (token) {
      deleteCookie("token"); // توکن رو حذف می‌کنیم
      await deleteUserAction(token); // از هر API برای حذف کاربر استفاده کن
    } else {
      console.log("No token found.");
    }
  };

  // تابع برای فچ کردن داده‌های کاربر
  const fetchData = async () => {
    try {
      const token = document.cookie
        .split("; ") // جدا کردن هر کوکی
        .find((row) => row.startsWith("token=")) // پیدا کردن کوکی‌ای که نامش 'token' باشد
        ?.split("=")[1]; // جدا کردن مقدار token از کل رشته

      setUserLoading(true);

      if (token?.trim()) {
        const response = await fetch("/api/auth", {
          method: "GET", // چون API GET است
          credentials: "include", // ارسال کوکی به سرور
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setuser(data.data);
      } else {
        setuser(null);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    setuser(null);
    const handleClick = async () => {
      if (isclickremoveme) {
        router.push("/");
        await removeme(); // حذف توکن و ریدایرکت
      }
      await fetchData(); // درخواست فچ کردن اطلاعات کاربر
    };

    handleClick(); // فراخوانی تابع handleClick
  }, [isclickremoveme]); // وابسته به تغییر isclickremoveme

  //... (سایر useEffect ها در اینجا هستند)

  useEffect(() => {
    // اگر هر یک از مودال‌ها باز باشد، اسکرول را مخفی کن
    if (open) {
      document.body.style.overflowY = "hidden";
    } else {
      // اگر هیچ مودالی باز نیست، اسکرول را فعال کن تا صفحه عادی رفتار کند.
      // اگر می‌خواهید در حالت عادی هم اسکرول نباشد، باید این خط را حذف کرده
      // و از روش CSS سراسری (body { overflow-y: hidden; }) استفاده کنید.
      document.body.style.overflowY = "unset";
    }

    return () => {
      document.body.style.overflowY = "unset";
    };
  }, [open]);

  //... (سایر useEffect ها در اینجا هستند)
  return (
    <div>
      <div
        className={`
        fixed bg-primry/70 top-0 left-0 w-full z-50 pb-4
        ${
          scrolled
            ? `bg-primry/70 shadow-[0_0_4px_0_rgba(0,0,0,0.1686)] py-2  ${
                open
                  ? "backdrop-blur-none"
                  : !showmodaluser
                  ? "backdrop-blur-[6px]"
                  : ""
              }`
            : "bg-transparent py-4"
        }
      `}
      >
        <header className="containers relative">
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center w-full max-lg:justify-between">
              <div className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  data-open={open}
                  className="
    relative flex items-center justify-center lg:hidden
    w-6 h-6 cursor-pointer transition-all duration-200
    max-[400px]:w-6 max-[400px]:h-6   /* 16px × 16px */
  "
                >
                  <span
                    data-open={open}
                    className="
      relative z-20
      w-6 h-[2px] bg-black transition-all duration-200

      before:content-[''] before:absolute before:left-0
      before:w-6 before:h-[2px] before:bg-black before:-translate-y-[8px]
      before:transition-all before:duration-200

      after:content-[''] after:absolute after:left-0
      after:w-6 after:h-[2px] after:bg-black after:translate-y-[8px]
      after:transition-all after:duration-200

      /* حالت باز */
      data-[open=true]:bg-transparent
      data-[open=true]:before:rotate-45 data-[open=true]:before:translate-y-0
      data-[open=true]:after:-rotate-45 data-[open=true]:after:translate-y-0

      /* رسپانسیو زیر 400px */
      max-[400px]:w-[24px] max-[400px]:h-[1px]
      max-[400px]:before:w-[24px] max-[400px]:before:h-[1px] max-[400px]:before:-translate-y-[8px]
      max-[400px]:after:w-[24px] max-[400px]:after:h-[1px] max-[400px]:after:translate-y-[8px]
    "
                  ></span>
                </button>

                {open ? (
                  <>
                    <div
                      onClick={() => {
                        setOpen(false);
                      }}
                      className="w-screen h-screen fixed top-0 transition-all  bottom-0 right-0 left-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-[6px] z-10 "
                    ></div>
                    <div className="bg-primry  max-[450px]:min-w-[100%] w-[450px] max-[450px]: max-lg:w-[350px] max-md:w-[250px] h-screen fixed top-0 transition-all duration-200 bottom-0 left-0 z-50 flex items-center justify-start flex-col mb-auto ">
                      <div className="hidden items-center justify-between w-full border-b-[1px] border-b-gray-300 p-2 px-[30px] max-[450px]:flex mb-4">
                        <button
                          onClick={() => setOpen(!open)}
                          data-open={open}
                          className="
                   relative flex items-center justify-center lg:hidden
                   w-10 h-10           /* اندازه کلیک بزرگ‌تر */
                   cursor-pointer      /* دست موقع هاور */
                   transition-all duration-200
                   "
                        >
                          <span
                            className=" z-20 
                     relative w-6 h-[2px] bg-black transition-all duration-200
                     before:content-[''] before:absolute before:left-0 before:w-6 before:h-[2px] before:bg-black before:-translate-y-[8px] before:transition-all before:duration-200
                     after:content-[''] after:absolute after:left-0 after:w-6 after:h-[2px] after:bg-black after:translate-y-[8px] after:transition-all after:duration-200
           
                     data-[open=true]:bg-transparent
                     data-[open=true]:before:rotate-45 data-[open=true]:before:translate-y-0
                     data-[open=true]:after:-rotate-45 data-[open=true]:after:translate-y-0
                   "
                            data-open={open}
                          ></span>
                        </button>
                        <div className="max-[300px]:hidden">
                          <Link href="/">
                            <Image
                              className="max-lg:w-[158px] max-md:w-[118px] lg:ml-[35px]"
                              width={191}
                              height={23}
                              src="/fill-font-img-svg-icon/images/Logo.svg.png"
                              alt="logo"
                              quality={100}
                            />
                          </Link>
                        </div>
                      </div>

                      {user ? (
                        /* کاربر وارد شده */
                        <div className="flex justify-between items-center w-full">
                          {/* پنل کاربری */}
                          <div className="relative w-full">
                            <div
                              onClick={() => setshowmodaluser(!showmodaluser)}
                              className="w-full z-[200] h-[42px] relative  flex justify-center items-center cursor-pointer border border-[rgba(0,0,0,0.105)]"
                            >
                              <Link
                                href="/panel"
                                className="gap-3 flex justify-center items-center cursor-pointer"
                              >
                                <div>
                                  <svg className="w-5 h-5 text-black">
                                    <use href="#user"></use>
                                  </svg>
                                </div>
                                <div className="text-sm select-none">
                                  پنل کاربری
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* کاربر وارد نشده */
                        <>
                          <Link href="/signup" className="w-full">
                            <div className="w-full h-[42px] flex justify-center items-center cursor-pointer border  border-[rgba(0,0,0,0.105)]">
                              <div className="ml-3">
                                <svg className="w-5 h-5 text-black">
                                  <use href="#user"></use>
                                </svg>
                              </div>
                              <div className="text-sm">ورود / ثبت نام</div>
                            </div>
                          </Link>
                        </>
                      )}

                      <div className="flex justify-between items-center gap-9 flex-col ml-auto px-[30px] mt-[15px]">
                        <Link href={"/products"}>
                          <div>محصولات</div>
                        </Link>
                        <Link href={"/about-us"}>
                          <div>درباره ی ما</div>
                        </Link>
                        <Link href={"/contact-us"}>
                          <div>تماس با من</div>
                        </Link>
                      </div>

                      {user && (
                        // /* delet acount for mobile */

                        <div
                          onClick={() => {
                            setuser(null);
                            setOpen(false);
                            setisclickremoveme(true);
                            toast.success("با موفقیت خارج شدید", {
                              position: "top-center",
                              autoClose: 2000,
                              hideProgressBar: false,
                              closeOnClick: false,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                              transition: Bounce,
                            });
                          }}
                          className="flex mb-4 px-[32px] items-center mt-auto ml-auto gap-2 text-dark-charcoal w-full cursor-pointer py-2 text-lg rounded-xl  "
                        >
                          <svg
                            className="mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <g
                              stroke="currentColor" // ← وابسته به رنگ پرنت
                              strokeLinecap="round"
                              strokeWidth="1.5"
                              clipPath="url(#clip0_1917_10656)"
                            >
                              {/* مسیر فلش خروج */}
                              <path
                                strokeLinejoin="round"
                                d="M7.5 12H21m0 0-4.701 5M21 12l-4.701-5"
                              />
                              {/* مسیر جعبه */}
                              <path d="M10 3H7c-1.886 0-2.828 0-3.414.586S3 5.114 3 7v10c0 1.886 0 2.828.586 3.414S5.114 21 7 21h3" />
                            </g>
                            <defs>
                              <clipPath id="clip0_1917_10656">
                                <path fill="#fff" d="M24 0v24H0V0z" />
                              </clipPath>
                            </defs>
                          </svg>
                          <p>خروج</p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      onClick={() => {
                        setOpen(false);
                      }}
                      className=" w-[0px] h-screen fixed top-0 transition-all duration-200 bottom-0 right-0 left-0 bg-[rgba(0,0,0,0.7)]  backdrop-blur-[6px] z-10"
                    ></div>

                    <div className="bg-primry z-50 w-[450px] h-screen transition-all duration-200 fixed top-0 bottom-0 left-[-500px] "></div>
                  </>
                )}
              </div>

              {/* menu */}

              <div className="mx-[15px] max-lg:w-[158px] max-md:w-[118px] lg:ml-[35px] max-md:h-[32px] ">
                <Link href="/">
                  <Image
                    className="mfax-lg:w-[158px] max-md:w-[118px] lg:ml-[35px] flex"
                    width={191}
                    height={52}
                    src="/fill-font-img-svg-icon/images/Logo.svg.png"
                    alt="logo"
                    quality={100}
                    priority
                  />
                </Link>
              </div>

              <Link href="/cart">
                <div className="relative lg:hidden cursor-pointer">
                  <svg className="w-[20px] h-[20px]">
                    <use href="#cartsmobile"></use>
                  </svg>
                  <div
                    className={`absolute flex justify-center items-center shadow-[0_0_4px_0_rgba(0,0,0,0.1686)] w-[18px] h-[18px] border rounded-full text-[11px] border-sandstone top-[-6px] left-[-12px] bg-sandstone text-white text-Yekan ${
                      !user && `!bg-primry !border-none`
                    }`}
                  >
                    {user && datacart[0]?.totalQuantity}
                  </div>
                </div>
              </Link>

              <div className="flex justify-between items-center gap-9 max-lg:hidden *:cursor-pointer">
                <Link href={"/products"}>
                  <div>محصولات</div>
                </Link>
                <Link href={"/about-us"}>
                  <div>درباره ی ما</div>
                </Link>
                <Link href={"/contact-us"}>
                  <div>تماس با من</div>
                </Link>
              </div>
            </div>
            <div className="flex justify-between items-center max-lg:hidden">
              {/* دکمه جستجو */}
              <div
                className="w-[42px] h-[42px] border rounded-full flex items-center justify-center border-[rgba(0,0,0,0.105)] gap-3 cursor-pointer"
                onClick={() => setOpensearch(!open)}
              >
                <svg className="w-5 h-5 text-black">
                  <use href="#search"></use>
                </svg>
              </div>

              {/* وضعیت لودینگ */}
              {userLoading ? (
                <div className="flex justify-between items-center mr-3">
                  <div className="w-[126px] h-[42px] mx-3 bg-gray-300 animate-pulse rounded-[42px]"></div>
                  <div className="w-[100px] h-[42px] bg-gray-300 animate-pulse rounded-[42px]"></div>
                </div>
              ) : user ? (
                /* کاربر وارد شده */
                <div className="flex justify-between items-center">
                  {/* پنل کاربری */}
                  <div className="relative">
                    <div
                      onClick={() => setshowmodaluser(!showmodaluser)}
                      className="w-[126px] z-[200] h-[42px] mx-3 flex justify-center items-center cursor-pointer relative border rounded-[42px] border-[rgba(0,0,0,0.105)]"
                    >
                      <div className="ml-3">
                        <svg className="w-5 h-5 text-black">
                          <use href="#user"></use>
                        </svg>
                      </div>
                      <div className="text-sm select-none">پنل کاربری</div>
                    </div>

                    {/* مودال کاربر */}
                    {showmodaluser && (
                      <div className="absolute top-[64px] left-[12px]  bg-primry rounded-lg w-70 z-[200] select-none shadow-[0_0_4px_0_rgba(0,0,0,0.1686)] flex items-center justify-center flex-col p-4 gap-3">
                        <div className="flex items-center gap-3 w-full">
                          <div className="w-14 h-14 cursor-pointer border border-[#0000001b] rounded-full flex items-center justify-center">
                            {user.img ? (
                              <Image
                                src={user.img}
                                alt="img user"
                                width={100}
                                height={100}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                }}
                              />
                            ) : (
                              <Image
                                src="/fill-font-img-svg-icon/images/profile.jpg"
                                alt="img user"
                                width={1000}
                                height={1000}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  borderRadius: "50%",
                                }}
                              />
                            )}
                          </div>
                          <div>{user.username}</div>
                        </div>
                        <div
                          className="flex relative items-center ml-auto gap-2 text-dark-charcoal w-full cursor-pointer hover:bg-[#E2DFD3] transition hover:text-charcoal duration-200 ease-in-out py-2 rounded-xl text-lg before:absolute before:top-[-6px] before:left-0 before:w-full before:h-[1px] before:bg-[#0000001b]
                after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[1px] after:bg-[#0000001b]"
                        >
                          <Link
                            className="flex items-center ml-auto gap-2"
                            href="/panel"
                          >
                            <svg className="w-5 h-5 mr-2 ">
                              <use href="#user"></use>
                            </svg>
                            <p>جزئیات حساب </p>
                          </Link>
                        </div>
                        <div
                          onClick={() => {
                            setuser(null);
                            setisclickremoveme(true);
                            toast.success("با موفقیت خارج شدید", {
                              position: "top-center",
                              autoClose: 2000,
                              hideProgressBar: false,
                              closeOnClick: false,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                              transition: Bounce,
                            });
                          }}
                          className="flex items-center ml-auto gap-2 text-dark-charcoal w-full cursor-pointer hover:text-charcoal hover:bg-sandstone transition duration-200 ease-in-out py-2 text-lg rounded-xl  "
                        >
                          <svg
                            className="mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width={24}
                            height={24}
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <g
                              stroke="currentColor" // ← وابسته به رنگ پرنت
                              strokeLinecap="round"
                              strokeWidth="1.5"
                              clipPath="url(#clip0_1917_10656)"
                            >
                              {/* مسیر فلش خروج */}
                              <path
                                strokeLinejoin="round"
                                d="M7.5 12H21m0 0-4.701 5M21 12l-4.701-5"
                              />
                              {/* مسیر جعبه */}
                              <path d="M10 3H7c-1.886 0-2.828 0-3.414.586S3 5.114 3 7v10c0 1.886 0 2.828.586 3.414S5.114 21 7 21h3" />
                            </g>
                            <defs>
                              <clipPath id="clip0_1917_10656">
                                <path fill="#fff" d="M24 0v24H0V0z" />
                              </clipPath>
                            </defs>
                          </svg>
                          <p>خروج</p>
                        </div>
                      </div>
                    )}

                    {/* بک‌گراند تار */}
                    {showmodaluser && (
                      <div
                        onClick={() => setshowmodaluser(false)}
                        className="inset-0 fixed z-[100] backdrop-blur-[8px] bg-black/40"
                      ></div>
                    )}
                  </div>

                  {/* سبد خرید */}
                  <Link href="/cart">
                    <div className="w-[100px] h-[42px] relative flex bg-sandstone text-white justify-center items-center border rounded-[42px] border-[rgba(0,0,0,0.105)]">
                      <svg className="w-5 h-5 ml-1">
                        <use href="#carts"></use>
                      </svg>

                      <div className="absolute flex justify-center items-center shadow-[0_0_4px_0_rgba(0,0,0,0.1686)] w-[18px] h-[18px] border rounded-full text-[11px] border-white top-[-4px] left-[-7px] text-sandstone bg-white text-Yekan">
                        {datacart[0]?.totalQuantity || 0}
                      </div>
                    </div>
                  </Link>
                </div>
              ) : (
                /* کاربر وارد نشده */
                <>
                  <Link href="/signup">
                    <div className="w-[156px] h-[42px] mx-3 flex justify-center items-center cursor-pointer border rounded-[42px] border-[rgba(0,0,0,0.105)]">
                      <div className="ml-3">
                        <svg className="w-5 h-5 text-black">
                          <use href="#user"></use>
                        </svg>
                      </div>
                      <div className="text-sm">ورود / ثبت نام</div>
                    </div>
                  </Link>

                  <Link href="/signup">
                    <div className="w-[100px] h-[42px] relative flex bg-sandstone text-white justify-center items-center border rounded-[42px] border-[rgba(0,0,0,0.105)]">
                      <svg className="w-5 h-5 ml-1">
                        <use href="#carts"></use>
                      </svg>
                      <span className="text-xs">
                        <span className="ml-[2px] text-Yekan">0</span> تومان
                      </span>
                      <div className="absolute flex justify-center items-center shadow-[0_0_4px_0_rgba(0,0,0,0.1686)] w-[18px] h-[18px] border rounded-full text-[11px] border-white top-[-4px] left-[-7px] text-sandstone bg-white text-Yekan">
                        0
                      </div>
                    </div>
                  </Link>
                </>
              )}
            </div>

            {/* search */}
            <div
              className={`absolute right-0 left-0 bg-[#E2DFD3] overflow-hidden transition-[min-height] duration-200 z-[250] shadow-[0_0_4px_0_rgba(0,0,0,0.1686)]  ${
                opensearch
                  ? "min-h-[85vh] -top-[16px] py-[50px] "
                  : "min-h-0 top-[100vh]"
              }`}
            >
              <div className="containers ">
                <div className="w-[65%] m-auto ">
                  <div className="justify-end flex">
                    <button
                      onClick={() => setOpensearch(false)}
                      data-open={true}
                      className="
                   relative flex items-center justify-center
                   w-10 h-10           /* اندازه کلیک بزرگ‌تر */
                   cursor-pointer      /* دست موقع هاور */
                   transition-all duration-200
                   "
                    >
                      <span
                        className=" z-20 
                     relative w-6 h-[2px] bg-gray-400 transition-all duration-200
                     before:content-[''] before:absolute before:left-0 before:w-6 before:h-[2px] before:bg-gray-400 before:-translate-y-[8px] before:transition-all before:duration-200
                     after:content-[''] after:absolute after:left-0 after:w-6 after:h-[2px] after:bg-gray-400 after:translate-y-[8px] after:transition-all after:duration-200
           
                     data-[open=true]:bg-transparent
                     data-[open=true]:before:rotate-45 data-[open=true]:before:translate-y-0
                     data-[open=true]:after:-rotate-45 data-[open=true]:after:translate-y-0
                   "
                        data-open={true}
                      ></span>
                    </button>
                  </div>
                  <div
                    className="border-b-[1px] border-b-gray-500  max-sm:text-sm  p-2 gap-3 flex items-center justify-start mt-2"
                    onClick={() => setOpensearch(!open)}
                  >
                    <div className="cursor-pointer">
                      <svg className="w-7 h-7 text-gray-400">
                        <use href="#search"></use>
                      </svg>
                    </div>
                    <input
                      value={searchvalue}
                      onChange={(e) => setsearchvalue(e.target.value)}
                      className="font-bold text-xl outline-none max-[450px]:text-[13px]  placeholder:text-sandstone w-full"
                      type="text"
                      placeholder="جستوجوی محصولات"
                    />
                  </div>
                  {/* FIRE */}
                  <div
                    className={`${
                      load
                        ? "w-[90%] m-auto "
                        : "flex items-center justify-center"
                    }`}
                  >
                    {searchvalue ? (
                      includessearch.length > 0 || searchvalue.length <= 2 ? (
                        <div
                          className="flex items-center justify-evenly
                         px-10 text-lg flex-wrap gap-2 h-[250px] custom-scroll overflow-auto mt-10 "
                        >
                          {includessearch.map((item) => (
                            <div
                              key={item._id}
                              className="bg-primry p-2 px-5 rounded-3xl mt-4 flex gap-[4px] items-center cursor-pointer justify-center  max-[450px]:py-1  max-[450px]:px-3 max-[450px]:text-[16px]  "
                            >
                              <div className="cursor-pointer">
                                <svg className="w-5 h-5 text-gray-400">
                                  <use href="#search"></use>
                                </svg>
                              </div>
                              <Link
                                href={`/item/${item.description}`}
                                className="text-[#4F2C19]  max-[450px]:text-center"
                              >
                                {item.title}
                              </Link>
                            </div>
                          ))}
                        </div>
                      ) : load ? (
                        <div className="text-center mt-[100px] text-lg">
                          پیدا نشد لطفا دقیق تر بنویسید
                        </div>
                      ) : (
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
                      )
                    ) : (
                      popular && (
                        <div className="flex items-start flex-col justify-start">
                          <div className="flex gap-3 mb-[12px] mt-[40px] ">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6 text-gray-400"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                              />
                            </svg>
                            <p className="text-sm">بیشترین جستجوهای اخیر:‌</p>
                          </div>

                          <div className="flex items-center flex-wrap  gap-2 justify-evenly mr-5">
                            {popular.map((item) => (
                              <div
                                key={item._id}
                                className="bg-primry py-[6px] px-7 rounded-3xl mt-4 cursor-pointer "
                              >
                                {item.term}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {/* ////==--/////////FIRE///////// */}
                </div>
              </div>
            </div>
          </div>

          {/* search mobile */}

          <div className="">
            <div
              className="border-b-[1px] border-b-gray-400  max-sm:text-sm  p-2 gap-3 flex items-center justify-start mt-3 lg:hidden w-[85%] mx-auto"
              onClick={() => setOpensearchmobile(!open)}
            >
              <div className="cursor-pointer">
                <svg className="w-7 h-7 text-gray-400">
                  <use href="#search"></use>
                </svg>
              </div>
              <input
                value={searchvaluemobile}
                onChange={(e) => setsearchvaluemobile(e.target.value)}
                className="font-bold text-lg outline-none max-[450px]:text-[16px]  placeholder:text-sandstone w-full "
                type="text"
                placeholder="جستوجوی محصولات"
              />
            </div>

            <div
              className={`fixed right-0 left-0  lg:hidden  bg-[#E2DFD3] overflow-hidden transition-[min-height] duration-200 z-50 ${
                opensearchmobile
                  ? "min-h-[100vh] top-0 -bottom-[100vh]"
                  : "min-h-0 -top-[100vh] bottom-[100vh]"
              }`}
            >
              <div className="">
                <div className="w-full m-auto ">
                  <div className="flex border-b relative m-auto border-b-gray-300 shadow-[0_0_4px_0_rgba(0,0,0,0.1686)] py-4 mb-5 min-w-screen mx-auto">
                    <button
                      onClick={() => {
                        setOpensearchmobile(false);
                        setsearchvaluemobile("");
                      }}
                      data-open={true}
                      className="
                   absolute top-0 bottom-0 right-[10px] m-auto flex items-center justify-center
                   w-10 h-10           /* اندازه کلیک بزرگ‌تر */
                   cursor-pointer      /* دست موقع هاور */
                   transition-all duration-200
                   "
                    >
                      <span
                        className=" z-20 
                     relative w-6 h-[2px] bg-gray-400 transition-all duration-200
                     before:content-[''] before:absolute before:left-0 before:w-6 before:h-[2px] before:bg-gray-400 before:-translate-y-[8px] before:transition-all before:duration-200
                     after:content-[''] after:absolute after:left-0 after:w-6 after:h-[2px] after:bg-gray-400 after:translate-y-[8px] after:transition-all after:duration-200
           
                     data-[open=true]:bg-transparent
                     data-[open=true]:before:rotate-45 data-[open=true]:before:translate-y-0
                     data-[open=true]:after:-rotate-45 data-[open=true]:after:translate-y-0
                   "
                        data-open={true}
                      ></span>
                    </button>
                    <p className="justify-center w-full flex items-center text-xl">
                      جستوجو
                    </p>
                  </div>
                  <div className="containers">
                    <div
                      className="border-b-[1px] border-b-gray-500  max-sm:text-sm  p-2 gap-3 flex items-center justify-start mt-2"
                      onClick={() => setOpensearchmobile(!open)}
                    >
                      <div className="cursor-pointer">
                        <svg className="w-7 h-7 text-gray-400">
                          <use href="#search"></use>
                        </svg>
                      </div>
                      <input
                        value={searchvaluemobile}
                        onChange={(e) => setsearchvaluemobile(e.target.value)}
                        className="font-bold text-lg outline-none max-[450px]:text-[13px]  placeholder:text-sandstone w-full"
                        type="text"
                        placeholder="جستوجوی محصولات"
                      />
                    </div>
                    {/* FIRE */}

                    <div
                      className={`${
                        load
                          ? "w-[90%] m-auto "
                          : "flex items-center justify-center"
                      }`}
                    >
                      {searchvaluemobile ? (
                        includessearch.length > 0 ||
                        searchvaluemobile.length <= 2 ? (
                          <div
                            className="flex items-center justify-evenly
                       px-10 text-lg flex-wrap gap-2 h-[250px] custom-scroll overflow-auto mt-10 "
                          >
                            {includessearch.map((item) => (
                              <div
                                key={item._id}
                                className="bg-primry p-2 px-5 rounded-3xl mt-4 flex gap-[4px] items-center cursor-pointer justify-center  max-[450px]:py-1  max-[450px]:px-3 max-[450px]:text-[16px]  "
                              >
                                <div className="cursor-pointer">
                                  <svg className="w-5 h-5 text-gray-400">
                                    <use href="#search"></use>
                                  </svg>
                                </div>
                                <Link
                                  href={`/item/${item.description}`}
                                  className="text-[#4F2C19]  max-[450px]:text-center"
                                >
                                  {item.title}
                                </Link>
                              </div>
                            ))}
                          </div>
                        ) : load ? (
                          <div className="text-center mt-[100px] text-lg">
                            پیدا نشد لطفا دقیق تر بنویسید
                          </div>
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full animate-spin mt-[100px] "
                            style={{
                              background: `
      radial-gradient(farthest-side, #766DF4 94%, transparent) top/8px 8px no-repeat,
      conic-gradient(transparent 30%, #766DF4)
    `,
                              WebkitMask:
                                "radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0)",
                            }}
                          ></div>
                        )
                      ) : (
                        popular && (
                          <div className="flex items-start flex-col justify-start h-[450px] mt-5 custom-scroll overflow-auto pl-2">
                            <div className="flex gap-3 mb-[12px] mt-[40px] ">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6 text-gray-400"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"
                                />
                              </svg>
                              <p className="text-sm ">
                                بیشترین جستجوهای اخیر:‌
                              </p>
                            </div>

                            <div className="flex items-center flex-wrap  gap-2 justify-evenly mr-5">
                              {popular.map((item) => (
                                <div
                                  key={item._id}
                                  className="bg-primry py-[6px] px-7 rounded-3xl mt-4 cursor-pointer text-center"
                                >
                                  {item.term}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    {/* ////==--/////////FIRE///////// */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
