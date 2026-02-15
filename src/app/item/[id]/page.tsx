"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Toaster } from "react-hot-toast";

// Imports
import  { ProductType } from "@componnt/templates/header";
import Boutoon from "@componnt/modules/buttoncart";
import Button from "@componnt/modules/button";
import { Bounce, toast } from "react-toastify";
import { IUser } from "@MOLDS/users";
import Comment from "@componnt/modules/LikeDislike";

// --- Types ---
export interface Product {
  _id: string;
  name: string;
  price: number;
  title: string;
  count?: number;
}
export interface IAnswer {
  text: string;
  answeredAt: string;

  answeredBy: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
  };
}
export interface IQuestion {
  _id: string;
  question: string;
  productId: string;
  userId: IUser;

  answers: IAnswer[]; // ✅ همیشه وجود دارد

  createdAt: string;
}
export interface IComment {
  _id: string;

  comment: string;

  productId: string;

  userId: IUser;

  rating: number;

  likedBy: string[];

  dislikedBy: string[];

  Like: number;

  Dislike: number;

  createdAt: string; // ISO Date
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
}

export interface CartType {
  _id: string;
  items: CartItem[];
}
interface QuestionItem {
  _id: string;
  question: string;
  answer?: string;
  createdAt: string;
  userId: {
    firstname: string;
    lastname: string;
  };
}

const FEATURE_ICONS = {
  brand: (
    <svg
      className="w-5 h-5 md:w-6 md:h-6 text-[#B39371]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12M6 12h12" />
    </svg>
  ),
  flavor: (
    <svg
      className="w-5 h-5 md:w-6 md:h-6 text-[#B39371]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M8 10h8v6H8zM12 4v6M10 4h4" />
    </svg>
  ),
  arabica: (
    <svg
      className="w-5 h-5 md:w-6 md:h-6 text-[#B39371]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <ellipse cx="12" cy="12" rx="6" ry="9" />
      <path d="M12 3v18" />
    </svg>
  ),
  robusta: (
    <svg
      className="w-5 h-5 md:w-6 md:h-6 text-[#B39371]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="6" y="6" width="12" height="12" rx="3" />
      <path d="M6 12h12M12 6v12" />
    </svg>
  ),
};

export default function ProfessionalProductPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [Questio, setQuestio] = useState("");
  const [comments, setcomments] = useState("");
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);

  const [product, setProduct] = useState<ProductType | null>(null);
  const [cart, setCart] = useState<CartType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [user, setUser] = useState<string>("");
  const [commentfeath, setcommentfeath] = useState<IComment[] | []>([]);
  const [questionfeath, setquestionfeath] = useState<IQuestion[] | []>([]);
  const [loadingAnswerFor, setLoadingAnswerFor] = useState<string | null>(null);

  const [zoomStyle, setZoomStyle] = useState({
    backgroundPosition: "0% 0%",
    opacity: 0,
  });

  // برای کنترل باز و بسته بودن مودال
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMore, setShowMore] = useState(false); // حالت مشاهده بیشتر

  const [selectedQuestion, setSelectedQuestion] = useState<QuestionItem | null>(
    null
  );
  const [answerText, setAnswerText] = useState<string>("");

  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = document.cookie
          .split("; ") // جدا کردن هر کوکی
          .find((row) => row.startsWith("token=")) // پیدا کردن کوکی‌ای که نامش 'token' باشد
          ?.split("=")[1]; // جدا کردن مقدار token از کل رشته

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
          setUser(data.data._id);
        }
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };

    fetchData();
  }, []);

  const cleanTitle = useMemo(() => {
    const rawId = params.id as string;
    return rawId ? decodeURIComponent(rawId).replace(/-/g, " ") : "";
  }, [params.id]);

  useEffect(() => {
    const productId = product?._id;
    if (!productId) return;
    const fetchData = async () => {
      try {
        setLoading(true);

        const [commentsRes, questionsRes] = await Promise.all([
          fetch(`/api/Comment/${productId}`),
          fetch(`/api/Question/${productId}`),
        ]);

        if (!commentsRes.ok || !questionsRes.ok) {
          throw new Error("خطا در دریافت اطلاعات");
        }

        const commentsJson = await commentsRes.json();
        const questionsJson = await questionsRes.json();

        setcommentfeath(commentsJson.data || []);
        setquestionfeath(questionsJson.data || []);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "خطای ناشناخته‌ای رخ داد";

        toast.error(message, {
          position: "top-center",
          autoClose: 2000,
          theme: "light",
          transition: Bounce,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product?._id]);

  // -------------------------
  // ایجاد کامنت جدید
  // -------------------------
  const createComment = async () => {
    if (!product?._id || !user) return; // حتما product و user داشته باشیم

    const newComment = {
      comment: comments,
      userId: user,
      likedBy: [],
      dislikedBy: [],
      rating: rating,
      Like: 0,
      Dislike: 0,
    };

    try {
      const res = await fetch(`/api/Comment/${product._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });

      if (!res.ok) {
        if (res.status === 409) {
          setIsOpen(false);
          setRating(0);
          setcomments("");
          toast.error("شما قبلا یک کامنت برای این محصول نوشته اید", {
            position: "top-center",
            autoClose: 2000,
            theme: "light",
            transition: Bounce,
          });
          return;
        } else {
          const text = await res.text();
          toast.error(text, {
            position: "top-center",
            autoClose: 2000,
            theme: "light",
            transition: Bounce,
          });
        }
        return;
      }

      const data = await res.json();
      if (data) {
        setIsOpen(false);
        setRating(0);
        setcomments("");
        toast.success("کامنت شما بعد از تایید مدیر در صفحه نمایش داده میشود", {
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
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطای ناشناخته‌ای رخ داد";

      toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const createQuestion = async () => {
    if (!product?._id || !user) return;
    if (!Questio) return;

    try {
      const res = await fetch(`/api/Question/${product._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: Questio,
          userId: user,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server Error:", text);
        toast.error(text, { position: "top-center", autoClose: 2000 });
        return;
      }

      const data = await res.json();

      if (data) {
        setQuestio("");
        toast.success("پرسش شما بعد از تایید مدیر در صفحه نمایش داده میشود", {
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
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "خطای ناشناخته‌ای رخ داد";

      toast.error(message, {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  // -------------------------
  // دریافت سبد خرید
  // -------------------------
  const fetchCartData = useCallback(async () => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();

      setCart(data.carts?.[0] ?? null); // اگر موجود نبود null
    } catch (err) {
      console.error("Cart Fetch Error:", err);
    } finally {
      setTimeout(() => setIsUpdating(false), 400);
    }
  }, []);

  const handleOpenModal = (item: QuestionItem) => {
    setSelectedQuestion(item);
    setIsModalOpen(true);
  };

  // تابع بستن مودal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
    setAnswerText("");
  };

  // -------------------------
  // دریافت محصول
  // -------------------------
  const fetchProductData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prodouct");
      const data: ProductType[] = await res.json();
      const found = data.find(
        (p) => p.title === cleanTitle || p.description.includes(cleanTitle)
      );
      if (found) setProduct(found);
    } catch (err) {
      console.error("Product Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [cleanTitle]);

  // -------------------------
  // بارگذاری اولیه صفحه
  // -------------------------
  useEffect(() => {
    fetchProductData();
    fetchCartData();
  }, [fetchProductData, fetchCartData]);

  // -------------------------
  // گوش دادن به آپدیت سبد خرید
  // -------------------------
  useEffect(() => {
    const handleCartUpdate = () => fetchCartData();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [fetchCartData]);

  // منطق تشخیص بخش فعال هنگام اسکرول (Scroll Spy)
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["specs", "comments", "questions"];
      const scrollPosition = window.scrollY + 180; // آفست برای تشخیص دقیق‌تر زیر هدر

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ backgroundPosition: `${x}% ${y}%`, opacity: 1 });
  };

  // -------------------------
  // محاسبه آمار محصول در سبد خرید
  // -------------------------
  const stats = useMemo(() => {
    if (!product) return { qty: 1, total: 0, oldTotal: 0, profit: 0 };

    // پیدا کردن آیتم مرتبط با محصول در سبد
    const cartItem = cart?.items.find((i) => i.product._id === product._id);
    const quantity = cartItem?.quantity ?? 1;

    return {
      qty: quantity,
      total: product.finalPrice * quantity,
      oldTotal: product.price * quantity,
      profit: (product.price - product.finalPrice) * quantity,
    };
  }, [product, cart]);

  // -------------------------
  // داده دکمه افزودن به سبد
  // -------------------------
  const buttonData = useMemo(() => {
    if (!product || !cart) return null;

    const cartItem = cart.items.find((i) => i.product._id === product._id);

    if (!cartItem) return null;

    return {
      id: cartItem._id,
      quantity: cartItem.quantity,
      ccount: product.count || 0,
    };
  }, [product, cart]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-overlay") {
      setIsOpen(false);
    }
  };

  const toPersianDate = (isoDate: string) => {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(isoDate));
  };

  const handleLikeDislike = async (id: string, action: "like" | "dislike") => {
    try {
      // let sendAction = action;

      // if (!firstClickDone) {
      //   // اولین کلیک: عمل را برعکس می‌کنیم
      //   sendAction = action === "like" ? "dislike" : "like";
      //   setFirstClickDone(true);
      // }

      const res = await fetch(`/api/Comment/${id}`, {
        method: "PUT", // ✅ حالا با PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userId: user }), // userId حتماً ارسال میشه
      });

      const data = await res.json();

      if (data.success) {
        // 🔹 فقط Like/Dislike و آرایه‌ها رو آپدیت می‌کنیم
        setcommentfeath((prev) =>
          prev.map((c) =>
            c._id === id
              ? {
                  ...c, // حفظ بقیه داده‌ها مثل userId.firstName و lastName
                  Like: data.data.Like,
                  Dislike: data.data.Dislike,
                  likedBy: data.data.likedBy,
                  dislikedBy: data.data.dislikedBy,
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Error updating like/dislike:", err);
    }
  };

  const answerQuestion = async () => {
    if (!selectedQuestion?._id || !answerText.trim()) return;

    setLoadingAnswerFor(selectedQuestion._id); // فقط یک بار کلیک

    try {
      const res = await fetch(`/api/Question/answer/${selectedQuestion._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answer: answerText,
          adminId: user, // id ادمین
        }),
      });

      if (!res.ok) throw new Error("request failed");

      const result = await res.json();
      const updatedQuestion = result.data;

      // ✅ حفظ همه اطلاعات قبلی سوال‌ها و اضافه کردن جواب جدید
      setquestionfeath((prev) =>
        prev.map((q) =>
          q._id === updatedQuestion._id
            ? {
                ...q, // حفظ userId و question
                answers: [
                  ...(q.answers || []),
                  updatedQuestion.answers.slice(-1)[0],
                ],
              }
            : q
        )
      );

      setAnswerText("");
      setSelectedQuestion(null);
      setIsModalOpen(false);

      toast.success("بعد از تایید مدیر پاسخ در صفحه نمایش داده میشود", {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } catch (error) {
      console.error(error);
      toast.error("خطایی رخ داد", {
        position: "top-center",
        autoClose: 2000,
        theme: "light",
        transition: Bounce,
      });
    } finally {
      setLoadingAnswerFor(null);
    }
  };

  const totalComments = commentfeath.length;

  // میانگین امتیاز با 1 رقم اعشار
  const averageRating =
    totalComments === 0
      ? 0
      : commentfeath.reduce((sum, c) => sum + c.rating, 0) / totalComments;

  // تعداد هر ستاره
  const ratingCount = [1, 2, 3, 4, 5].reduce((acc, star) => {
    acc[star] = commentfeath.filter((c) => c.rating === star).length;
    return acc;
  }, {} as Record<number, number>);

  // درصد هر ستاره
  const getPercentage = (star: number) =>
    totalComments === 0
      ? 0
      : Math.round((ratingCount[star] / totalComments) * 100);

  // رندر ستاره‌ها با نیم ستاره واقعی
  const renderStars = (rating: number) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        // ستاره کامل
        stars.push(
          <span key={i} className="text-yellow-400 text-lg md:text-xl">
            ★
          </span>
        );
      } else if (i - 0.5 <= rating) {
        // نیم ستاره
        stars.push(
          <span
            key={i}
            className="relative inline-block text-gray-300 text-lg md:text-xl"
          >
            <span
              className="absolute overflow-hidden text-yellow-400"
              style={{ width: "50%" }}
            >
              ★
            </span>
            ★
          </span>
        );
      } else {
        // ستاره خالی
        stars.push(
          <span key={i} className="text-gray-300 text-lg md:text-xl">
            ★
          </span>
        );
      }
    }

    return stars;
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#B39371] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-vazir text-[#3D2B1F] animate-pulse">
            در حال لود محصول...
          </p>
        </div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center font-vazir text-xl">
        محصول یافت نشد.
      </div>
    );

  const staticImage = product.images[0]
    

  return (
    <div
      className={` ${
        isUpdating ? "cursor-wait" : ""
      }`}
      dir="rtl"
    >
      <Toaster position="top-center" />

      <main className="max-w-[1350px] mx-auto pt-24 md:pt-44 pb-32 md:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* تصویر محصول */}
          <div className="w-full lg:w-[45%] lg:sticky lg:top-44 flex justify-center">
            <div
              className="relative w-full max-w-[500px] aspect-square bg-white border border-[#EBE3D5] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-sm cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={() =>
                setZoomStyle((prev) => ({ ...prev, opacity: 0 }))
              }
            >
              <div
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
                style={{
                  backgroundImage: `url(/fill-font-img-svg-icon/images${staticImage})`,
                  backgroundSize: "200%",
                  backgroundPosition: zoomStyle.backgroundPosition,
                  opacity: zoomStyle.opacity,
                  backgroundRepeat: "no-repeat",
                }}
              />
              {product.discountPercent > 0 && (
                <div className="absolute top-6 right-6 z-20 bg-[#D34040] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center shadow-lg text-Yekan animate-pulse">
                  <span className="text-lg md:text-2xl font-black">
                    {product.discountPercent}%
                  </span>
                  <span className="text-[10px] font-bold">OFF</span>
                </div>
              )}
              <div className="relative w-full h-full p-6 md:p-12">
                <Image
                  src={`/fill-font-img-svg-icon/images${staticImage}`}
                  alt={product.title}
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>
            </div>
          </div>

          {/* محتوای متنی */}
          <div className="w-full lg:w-[30%] space-y-6 md:space-y-8">
            <div className="space-y-3">
              <span className="inline-block text-[#B39371] font-bold text-xs bg-[#F8F5F0] px-4 py-1 rounded-full border border-[#EBE3D5]">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-black text-[#3D2B1F] leading-tight">
                {product.title}
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { label: "برند", val: product.brand, svg: FEATURE_ICONS.brand },
                {
                  label: "طعم",
                  val: product.flavor,
                  svg: FEATURE_ICONS.flavor,
                },
                {
                  label: "عربیکا",
                  val: product.coffeeBlend?.arabica,
                  svg: FEATURE_ICONS.arabica,
                },
                {
                  label: "روبوستا",
                  val: product.coffeeBlend?.robusta,
                  svg: FEATURE_ICONS.robusta,
                },
              ]
                .filter((f) => f.val)
                .map((item, i) => (
                  <div
                    key={i}
                    className="border border-[#EBE3D5] p-3 md:p-4 rounded-2xl bg-white flex items-center gap-3 shadow-sm"
                  >
                    <div className="flex-shrink-0">{item.svg}</div>
                    <div className="min-w-0">
                      <p className="text-[9px] md:text-[10px] text-[#A6998E] font-bold uppercase">
                        {item.label}
                      </p>
                      <p className="text-xs md:text-sm font-black text-[#3D2B1F] text-Yekan truncate">
                        {item.val}
                      </p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-[#EBE3D5] shadow-sm">
              <h3 className="font-black text-[#3D2B1F] mb-4 text-sm md:text-base flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#B39371] rounded-full"></span>
                درباره محصول:
              </h3>
              <p className="text-justify font-medium text-[#6D5D50] text-sm leading-8">
                {product.description}
              </p>
            </div>
          </div>

          {/* باکس خرید دسکتاپ */}
          <div className="hidden lg:block lg:w-[25%] lg:sticky lg:top-44">
            <div
              className={`bg-white border border-[#EBE3D5] rounded-3xl p-6 shadow-sm space-y-5 transition-all duration-300 ${
                isUpdating ? "opacity-60 blur-[1px]" : "opacity-100"
              }`}
            >
              <div className="flex items-center justify-between text-sm pb-4 border-b border-gray-100 font-bold">
                <span className="text-gray-400 font-medium">وضعیت محصول</span>
                <span
                  className={
                    product.count > 0 ? "text-emerald-600" : "text-red-500"
                  }
                >
                  {product.count > 0 ? `موجود در انبار` : "ناموجود"}
                </span>
              </div>
              <div className="space-y-4">
                {product.discountPercent > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="relative text-gray-400 text-base text-Yekan">
                      {stats.oldTotal.toLocaleString()}
                      <span className="absolute left-0 right-0 top-[55%] h-[1px] bg-gray-400 -translate-y-1/2"></span>
                    </div>
                    <span className="bg-[#D34040] text-white text-[11px] font-black px-2 py-0.5 rounded-md text-Yekan">
                      {product.discountPercent}% <small>تخفیف</small>
                    </span>
                  </div>
                )}
                {product.discountPercent > 0 && (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 flex justify-between items-center">
                    <span className="text-[11px] text-emerald-700 font-bold">
                      سود شما:
                    </span>
                    <span className="text-sm text-emerald-700 font-black text-Yekan">
                      {stats.profit.toLocaleString()}{" "}
                      <small className="text-[10px]">تومان</small>
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-[#3D2B1F] text-Yekan mt-1 border-t border-gray-50 pt-3">
                  <span className="text-xs font-bold text-gray-500">
                    مبلغ پرداختی:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-3xl font-black italic">
                      {stats.total.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold">تومان</span>
                  </div>
                </div>
                <div
                  className={`w-full pt-2 ${
                    isUpdating ? "pointer-events-none" : ""
                  }`}
                >
                  {buttonData ? (
                    <Boutoon value={buttonData} onUpdate={fetchCartData} />
                  ) : (
                    <div className="w-full transition-transform active:scale-[0.98] [&>div]:w-full [&>div]:py-4 [&>div]:rounded-2xl [&>div]:text-lg [&>div]:font-black [&>div]:h-auto [&>div]:shadow-md [&>div]:bg-[#B39371]">
                      <Button id={product._id} />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold pt-1 text-center">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  تضمین کیفیت و بازگشت وجه قهوه دانه
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- بخش تب‌های هوشمند چسبیده به هدر --- */}
        <div className="mt-12 border-t border-[#EBE3D5] pt-4">
          <div className="sticky top-[105px] md:top-[106px] lg:top-[68px] z-[45] w-full bg-[#FDFCFB]/95 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-[1350px] mx-auto px-4 md:px-0">
              <div className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar flex-nowrap py-1">
                {[
                  { id: "specs", label: "مشخصات" },
                  { id: "comments", label: "دیدگاه‌ها" },
                  { id: "questions", label: "پرسش‌ها" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      const element = document.getElementById(tab.id);
                      if (element) {
                        // محاسبه آفست برای اینکه تیتر بخش‌ها هم زیر هدر نرود
                        const isMobile = window.innerWidth < 768;
                        const headerHeight = isMobile ? 110 : 80;
                        const tabHeight = 50;
                        const totalOffset = headerHeight + tabHeight;

                        const elementPosition =
                          element.getBoundingClientRect().top +
                          window.pageYOffset;

                        window.scrollTo({
                          top: elementPosition - totalOffset,
                          behavior: "smooth",
                        });
                        setActiveTab(tab.id);
                      }
                    }}
                    className={`pb-3 cursor-pointer pt-4 text-sm md:text-base font-black transition-all relative whitespace-nowrap flex-shrink-0 ${
                      activeTab === tab.id
                        ? "text-[#B39371]"
                        : "text-gray-400 hover:text-[#3D2B1F]"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#B39371] rounded-t-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-16 md:space-y-24 mt-8 md:mt-12">
            {/* ۱. مشخصات فنی */}
            <section id="specs" className="scroll-mt-40 px-4 md:px-0">
              <div className="flex items-center gap-4 mb-6 md:mb-10">
                <h4 className="font-black text-[#3D2B1F] text-xl md:text-2xl flex items-center gap-3">
                  <span className="w-1.5 h-7 bg-[#B39371] rounded-full"></span>
                  مشخصات فنی
                </h4>
              </div>

              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-[#EBE3D5] p-5 md:p-10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-1 md:gap-y-2">
                  {/* همیشه نمایش داده شود */}
                  <div className="flex items-center justify-between py-4 md:py-5 group">
                    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                      <div className="w-1 h-1 bg-[#B39371] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-gray-400 text-xs md:text-sm font-bold">
                        عنوان
                      </span>
                    </div>
                    <div className="flex-1 mx-2 md:mx-4 border-b border-dotted border-gray-200"></div>
                    <span className="text-[#3D2B1F] text-xs md:text-sm font-black text-left">
                      {product.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-4 md:py-5 group">
                    <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                      <div className="w-1 h-1 bg-[#B39371] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <span className="text-gray-400 text-xs md:text-sm font-bold">
                        قیمت
                      </span>
                    </div>
                    <div className="flex-1 mx-2 md:mx-4 border-b border-dotted border-gray-200"></div>
                    <span className="text-[#3D2B1F] text-xs md:text-sm font-black text-left">
                      {product.finalPrice} تومان
                    </span>
                  </div>

                  {/* مشخصات اضافی با انیمیشن و دو ستونه */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out col-span-2 ${
                      showMore
                        ? "max-h-[2000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-4">
                      {product.brand && (
                        <div className="flex items-center justify-between py-4 md:py-5 group">
                          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            <div className="w-1 h-1 bg-[#B39371] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-gray-400 text-xs md:text-sm font-bold">
                              برند
                            </span>
                          </div>
                          <div className="flex-1 mx-2 md:mx-4 border-b border-dotted border-gray-200"></div>
                          <span className="text-[#3D2B1F] text-xs md:text-sm font-black text-left">
                            {product.brand}
                          </span>
                        </div>
                      )}

                      {product.flavor && (
                        <div className="flex items-center justify-between py-4 md:py-5 group">
                          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            <div className="w-1 h-1 bg-[#B39371] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-gray-400 text-xs md:text-sm font-bold">
                              طعم
                            </span>
                          </div>
                          <div className="flex-1 mx-2 md:mx-4 border-b border-dotted border-gray-200"></div>
                          <span className="text-[#3D2B1F] text-xs md:text-sm font-black text-left">
                            {product.flavor}
                          </span>
                        </div>
                      )}

                      {product.coffeeBlend?.arabica && (
                        <div className="flex items-center justify-between py-4 md:py-5 group">
                          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            <div className="w-1 h-1 bg-[#B39371] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-gray-400 text-xs md:text-sm font-bold">
                              عربیکا
                            </span>
                          </div>
                          <div className="flex-1 mx-2 md:mx-4 border-b border-dotted border-gray-200"></div>
                          <span className="text-[#3D2B1F] text-xs md:text-sm font-black text-left">
                            {product.coffeeBlend.arabica}
                          </span>
                        </div>
                      )}

                      {product.coffeeBlend?.robusta && (
                        <div className="flex items-center justify-between py-4 md:py-5 group">
                          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            <div className="w-1 h-1 bg-[#B39371] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-gray-400 text-xs md:text-sm font-bold">
                              روبستا
                            </span>
                          </div>
                          <div className="flex-1 mx-2 md:mx-4 border-b border-dotted border-gray-200"></div>
                          <span className="text-[#3D2B1F] text-xs md:text-sm font-black text-left">
                            {product.coffeeBlend.robusta}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* دکمه مشاهده بیشتر */}
                <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="text-[#B39371] cursor-pointer text-xs font-black flex items-center gap-2 hover:text-[#3D2B1F] transition-colors"
                  >
                    {showMore ? "مشاهده کمتر" : "مشاهده بیشتر"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className={`w-3 h-3 transition-transform duration-500 ${
                        showMore ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </section>

            {/* ۲. دیدگاه‌ها */}
            <section id="comments" className="scroll-mt-40 px-4 md:px-0">
              <h4 className="font-black text-[#3D2B1F] mb-8 md:mb-12 flex items-center gap-2 text-xl">
                <span className="w-1.5 h-6 bg-[#B39371] rounded-full"></span>
                امتیاز و دیدگاه کاربران
              </h4>

              <div className="flex flex-col lg:flex-row gap-8 md:gap-12">
                <div className="lg:w-1/3">
                  <div className="lg:sticky lg:top-48 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-[#EBE3D5] shadow-sm">
                    {/* امتیاز کلی */}
                    <div className="flex items-center gap-6 mb-8">
                      <div className="text-5xl md:text-6xl font-black text-[#3D2B1F]">
                        {averageRating.toFixed(1)}
                      </div>

                      <div>
                        <div className="mb-1">{renderStars(averageRating)}</div>
                        <p className="text-gray-400 text-[10px] md:text-xs font-bold">
                          از مجموع {totalComments} امتیاز
                        </p>
                      </div>
                    </div>

                    {/* توزیع ستاره‌ها */}
                    <div className="space-y-3 mb-8">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-gray-500 w-2">
                            {star}
                          </span>

                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#B39371] rounded-full"
                              style={{ width: `${getPercentage(star)}%` }}
                            />
                          </div>

                          <span className="text-[9px] md:text-[10px] font-bold text-gray-400 w-10 text-left">
                            ({getPercentage(star)}٪)
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* دکمه ثبت دیدگاه */}
                    <button
                      onClick={() => setIsOpen(true)}
                      className="w-full bg-[#3D2B1F] text-white py-4 rounded-2xl cursor-pointer font-black text-xs hover:bg-black transition-all shadow-lg shadow-black/10"
                    >
                      ثبت دیدگاه جدید
                    </button>
                  </div>
                </div>

                {/* ساختار مودال */}
                {isOpen && (
                  <div
                    id="modal-overlay"
                    onClick={handleBackdropClick}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
                  >
                    <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl max-h-[90vh] flex flex-col animate-slideUp">
                      {/* هدر */}
                      <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                        <h3 className="text-[#3D2B1F] font-black text-lg">
                          دیدگاه خود را ایجاد کنید
                        </h3>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* محتوای فرم (Scrollable) */}
                      <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                        <div className="space-y-6">
                          {/* بخش ستاره‌ها */}
                          <div className="text-center bg-[#FDFCFB] py-6 rounded-3xl border border-[#EBE3D5]/50">
                            <p className="text-[#3D2B1F] font-black text-sm mb-3">
                              امتیاز شما به این محصول
                            </p>
                            <div className="flex flex-row-reverse justify-center gap-1">
                              {[5, 4, 3, 2, 1].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHover(star)}
                                  onMouseLeave={() => setHover(0)}
                                  className={`text-4xl transition-all ${
                                    (hover || rating) >= star
                                      ? "text-yellow-400"
                                      : "text-gray-200"
                                  }`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-500 mr-2">
                              متن دیدگاه <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              value={comments}
                              onChange={(e) => setcomments(e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-[2rem] p-5 text-sm focus:border-[#B39371] outline-none resize-none"
                              placeholder="تجربه خود را بنویسید..."
                            ></textarea>
                          </div>

                          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                            <p className="text-[10px] leading-6 text-blue-700 font-bold">
                              ارسال دیدگاه به منزله پذیرش قوانین سایت است.
                              دیدگاه شما پس از بررسی و تایید، منتشر خواهد شد.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* فوتر مودال */}
                      <div className="p-6 border-t border-gray-100 flex-shrink-0">
                        <button
                          onClick={() => {
                            createComment();
                          }}
                          className="w-full bg-[#B39371] cursor-pointer text-white py-4 rounded-2xl font-black text-sm hover:bg-[#3D2B1F] shadow-lg shadow-[#B39371]/20 transition-all flex items-center justify-center gap-2"
                        >
                          <span>ثبت دیدگاه جدید</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 3L3 12l9 9M21 12H3"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="lg:w-2/3 space-y-6">
                  {commentfeath.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-white p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-[#EBE3D5] shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F8F5F0] rounded-2xl flex items-center justify-center text-[#B39371] font-black italic border border-[#EBE3D5] flex-shrink-0">
                            {comment.userId.firstname}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-black text-xs md:text-sm text-[#3D2B1F]">
                                {comment.userId.firstname +
                                  " " +
                                  comment.userId.lastname}
                              </p>
                            </div>
                            <span className="text-[9px] md:text-[10px] text-gray-400 font-bold">
                              {toPersianDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 text-yellow-400 text-sm md:text-lg ">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>
                              {i < comment.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pr-4 border-r-4 border-[#F8F5F0] mb-6">
                        <p className="text-xs md:text-sm leading-7 md:leading-8 text-[#6D5D50] font-medium">
                          {comment.comment}
                        </p>
                      </div>

                      <Comment
                        comment={comment} // ❌ اشتباه
                        currentUser={user}
                        handleLikeDislike={handleLikeDislike}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ۳. پرسش‌ها */}
            <section id="questions" className="scroll-mt-40 pb-20 px-4 md:px-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                <h4 className="font-black text-[#3D2B1F] flex items-center gap-2 text-xl">
                  <span className="w-1.5 h-6 bg-[#B39371] rounded-full"></span>
                  پرسش و پاسخ
                  <span className="text-gray-400 text-sm font-bold mr-2">
                    ({questionfeath.length});
                  </span>
                </h4>
                <button
                  onClick={() => setIsQuestionModalOpen(true)}
                  className="bg-[#3D2B1F] cursor-pointer text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-lg shadow-black/10 text-center"
                >
                  ثبت پرسش جدید
                </button>
                {/* مودال ثبت پرسش */}
                {isQuestionModalOpen && (
                  <div
                    id="question-overlay"
                    onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                      if (
                        (e.target as HTMLDivElement).id === "question-overlay"
                      )
                        setIsQuestionModalOpen(false);
                    }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
                  >
                    <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl animate-slideUp overflow-hidden">
                      {/* هدر مودال */}
                      <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-6 bg-[#B39371] rounded-full"></span>
                          <h3 className="text-[#3D2B1F] font-black text-lg">
                            پرسش خود را مطرح کنید
                          </h3>
                        </div>
                        <button
                          onClick={() => setIsQuestionModalOpen(false)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* فرم پرسش */}
                      <div className="p-6 md:p-8">
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-500 mr-2">
                              متن پرسش <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              rows={5}
                              onChange={(e) => setQuestio(e.target.value)}
                              value={Questio}
                              className="w-full bg-gray-50 border border-gray-200 rounded-[2rem] p-5 text-sm focus:border-[#B39371] focus:bg-white outline-none resize-none transition-all font-medium"
                              placeholder="پرسش خود را در مورد این کالا بنویسید..."
                            ></textarea>
                          </div>

                          <div className="bg-[#FDFCFB] border border-[#EBE3D5] rounded-2xl p-4 flex gap-3">
                            <svg
                              className="w-5 h-5 text-[#B39371] flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <p className="text-[10px] leading-6 text-[#6D5D50] font-bold">
                              پرسش شما پس از تایید توسط کارشناسان منتشر خواهد
                              شد. لطفاً از پرسیدن سوالات غیرمرتبط خودداری کنید.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* فوتر مودال */}
                      <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <button
                          className="w-full cursor-pointer bg-[#B39371] text-white py-4 rounded-2xl font-black text-sm hover:bg-[#3D2B1F] shadow-lg shadow-[#B39371]/20 transition-all flex items-center justify-center gap-2"
                          onClick={() => {
                            createQuestion();
                            setIsQuestionModalOpen(false);
                          }}
                        >
                          <span>ثبت پرسش</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M12 3L3 12l9 9M21 12H3"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative space-y-6">
                {questionfeath.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-[#EBE3D5] shadow-sm overflow-hidden hover:border-[#B39371]/40 transition-all"
                  >
                    {/* ---------- سوال ---------- */}
                    <div className="p-5 md:p-6 flex gap-4 pb-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-[#F8F5F0] rounded-2xl flex items-center justify-center border border-[#EBE3D5] flex-shrink-0">
                        <span className="text-[#B39371] font-black text-lg">
                          {item.userId?.firstname?.[0]}
                        </span>
                      </div>

                      <div className="flex-1">
                        <p className="text-sm md:text-base font-bold text-[#3D2B1F] leading-7 md:leading-8 mb-3">
                          {item.question}
                        </p>

                        <div className="flex items-center gap-2 mb-4 text-[11px] font-medium text-gray-400">
                          <span>
                            {item.userId?.firstname} {item.userId?.lastname}
                          </span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full" />
                          <span>{toPersianDate(item.createdAt)}</span>
                        </div>

                        {/* ---------- دکمه ثبت پاسخ ---------- */}
                        <div className="pt-3 border-t border-[#EBE3D5]">
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="group flex items-center gap-2 text-[#B39371] hover:bg-[#B39371]/5 px-3 py-2 rounded-xl transition-all bg-transparent border-none cursor-pointer"
                          >
                            <div className="w-6 h-6 rounded-lg bg-[#B39371]/10 flex items-center justify-center group-hover:bg-[#B39371] group-hover:text-white transition-all">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                />
                              </svg>
                            </div>
                            <span className="text-xs font-black">
                              {item.answers?.length
                                ? "افزودن پاسخ جدید"
                                : "ثبت پاسخ مدیریت"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ---------- پاسخ‌ها ---------- */}
                    {item.answers?.length > 0 && (
                      <div className="bg-[#FDFCFB] p-5 md:p-6 border-t border-[#EBE3D5] space-y-4">
                        {item.answers.map((ans, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#B39371] rounded-xl flex items-center justify-center shadow-md shadow-[#B39371]/20">
                              <span className="text-white text-[9px] md:text-[10px] font-black">
                                {ans.answeredBy?.role || "admin"}
                              </span>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-[#B39371]">
                                  {ans.answeredBy?.firstname}{" "}
                                  {ans.answeredBy?.lastname}
                                </span>
                                <span className="text-[9px] text-gray-400">
                                  {toPersianDate(ans.answeredAt)}
                                </span>
                              </div>

                              <p className="text-xs md:text-sm text-[#6D5D50] leading-6 md:leading-7 font-medium">
                                {ans.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* ---------- مودال پاسخ ---------- */}
                {isModalOpen && selectedQuestion && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                      className="absolute inset-0 bg-[#3D2B1F]/40 backdrop-blur-sm cursor-pointer"
                      onClick={handleCloseModal}
                    />

                    <div className="relative bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-[#EBE3D5] animate-in fade-in zoom-in duration-200">
                      <div className="p-6 border-b border-[#EBE3D5] flex justify-between items-center bg-[#FDFCFB]">
                        <h3 className="font-black text-[#3D2B1F] text-lg">
                          ارسال پاسخ مدیریت
                        </h3>
                        <button
                          onClick={handleCloseModal}
                          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all border-none"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="bg-[#F8F5F0] rounded-2xl p-4 border border-[#EBE3D5]/50">
                          <p className="text-[10px] text-[#B39371] font-black mb-1 uppercase">
                            متن پرسش
                          </p>
                          <p className="text-xs md:text-sm font-bold text-[#6D5D50] leading-6 md:leading-7">
                            {selectedQuestion.question}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-black text-[#3D2B1F] flex justify-between">
                            <span>پاسخ شما</span>
                            <span className="text-gray-400 font-medium">
                              {answerText.length} کاراکتر
                            </span>
                          </label>
                          <textarea
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            className="w-full bg-gray-50 border border-[#EBE3D5] rounded-[1.5rem] p-4 text-sm outline-none focus:border-[#B39371] focus:ring-4 focus:ring-[#B39371]/5 min-h-[160px] resize-none transition-all placeholder:text-gray-300"
                            placeholder="پاسخ خود را بنویسید..."
                          ></textarea>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              if (loadingAnswerFor) return; // فقط یک بار کلیک
                              answerQuestion();
                            }}
                            disabled={!answerText.trim() || !!loadingAnswerFor}
                            className="flex-1 cursor-pointer bg-[#3D2B1F] text-white py-4 rounded-2xl font-black text-sm hover:opacity-95 transition-all shadow-lg shadow-[#3D2B1F]/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {loadingAnswerFor === selectedQuestion._id
                              ? "در حال ثبت..."
                              : "تایید و انتشار پاسخ"}
                          </button>

                          <button
                            onClick={handleCloseModal}
                            className="px-6 cursor-pointer bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all  border-none"
                          >
                            انصراف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* نوار خرید موبایل */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] transition-all ${
          isUpdating ? "opacity-50 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex flex-row-reverse items-center justify-between gap-4 max-w-md mx-auto">
          <div className="flex flex-col items-end text-Yekan">
            {product.discountPercent > 0 && (
              <span className="text-[10px] line-through text-gray-400">
                {stats.oldTotal.toLocaleString()}
              </span>
            )}
            <div className="flex items-center gap-1 text-[#3D2B1F]">
              <span className="text-xl font-black">
                {stats.total.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold">تومان</span>
            </div>
          </div>
          <div className="w-[140px]">
            {buttonData ? (
              <Boutoon value={buttonData} onUpdate={fetchCartData} />
            ) : (
              <Button id={product._id} />
            )}
          </div>
        </div>
      </div>
      {/* استایل‌های انیمیشن */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ebe3d5;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
