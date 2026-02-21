"use client";
import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  ShoppingBag,
  MessageCircle,
  HelpCircle,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Star,
  CheckCircle2,
  Clock,
  MessageSquare,
  CornerDownLeft,
  Calendar,
  ThumbsUp,
  ShieldCheck,
  ThumbsDown,
  ArrowRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

/* =========================
    TYPES (اصلاح شده)
========================= */
interface UserProfile {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  img?: string;
  role: string;
  __v: number;
}

interface UserProfileResponse {
  data: UserProfile;
  error: string | null;
}

interface Product {
  _id: string;
  title: string;
  price: number;
  images: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  _id: string;
  items: CartItem[];
}

interface CartResponse {
  carts: Cart[];
}

interface Comment {
  _id: string;
  comment: string;
  rating: number;
  isActive: boolean;
  createdAt: string;
  likes?: number; // اضافه شده
  dislikes?: number; // اضافه شده
}

interface CommentResponse {
  success: boolean;
  data: Comment[];
}

interface Answer {
  text: string;
  answeredBy: AnsweredBy;
}

interface AnsweredBy {
  firstname: string;
}
interface Question {
  _id: string;
  question: string;
  answers: Answer[];
  isActive: boolean; // اضافه شده
  createdAt: string;
}

interface QuestionResponse {
  success: boolean;
  data: Question[];
}

interface UpdatePayload {
  imageBase64?: string;
  currentPassword?: string;
  newPassword?: string;
}

type TabType = "cart" | "comments" | "questions" | "profile";

const toPersianNumber = (value: number | string): string =>
  value.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);

/* ========================= */

export default function UltimateUserPanel() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =========================
      QUERIES
  ========================= */
  const { data: userProfileData, isLoading: userLoading } =
    useQuery<UserProfileResponse>({
      queryKey: ["userProfile"],
      queryFn: async () => {
        const res = await fetch("/api/auth");
        if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
        return res.json();
      },
    });

  const { data: cartData, isLoading: cartLoading } = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch("/api/cart");
      if (!res.ok) return { carts: [] };
      return res.json();
    },
    staleTime: 1000 * 60 * 50,
  });

  const { data: commentData, isLoading: commentLoading } =
    useQuery<CommentResponse>({
      queryKey: ["comments"],
      queryFn: async () => {
        const res = await fetch("/api/Comment/UserComment");
        if (!res.ok) return { success: false, data: [] };
        return res.json();
      },
    });

  const { data: questionData, isLoading: questionLoading } =
    useQuery<QuestionResponse>({
      queryKey: ["questions"],
      queryFn: async () => {
        const res = await fetch("/api/Question/UserQuestion");
        if (!res.ok) return { success: false, data: [] };
        return res.json();
      },
    });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "خطایی رخ داد");
      return result;
    },
    onSuccess: () => {
      toast.success("تغییرات با موفقیت ذخیره شد");
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPreviewImage(null);
      setErrors({});
    },
    onError: (err: Error) => toast.error(err.message),
  });

  /* =========================
      HANDLERS
  ========================= */
  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    const payload: UpdatePayload = {};

    if (previewImage) payload.imageBase64 = previewImage;

    if (newPassword || currentPassword || confirmPassword) {
      if (!currentPassword)
        newErrors.currentPassword = "رمز عبور فعلی الزامی است";
      else if (currentPassword.length < 6)
        newErrors.currentPassword = "حداقل ۶ کاراکتر باشد";

      if (!newPassword) newErrors.newPassword = "رمز عبور جدید را وارد کنید";
      else if (newPassword.length < 6)
        newErrors.newPassword = "حداقل ۶ کاراکتر باشد";

      if (newPassword !== confirmPassword)
        newErrors.confirmPassword = "رمزهای جدید همخوانی ندارند";

      if (Object.keys(newErrors).length === 0) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (Object.keys(payload).length === 0)
      return toast.error("تغییری ایجاد نشده است");
    updateMutation.mutate(payload);
  };

  if (userLoading || cartLoading || commentLoading || questionLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#FDFCFB] text-[#3D2B1F]">
        <Loader2 className="animate-spin ml-3" />{" "}
        <span className="text-sm font-medium">درحال بارگذاری...</span>
      </div>
    );
  }

  const userProfile = userProfileData?.data;
  const cartItems = cartData?.carts?.[0]?.items || [];

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div className="flex min-h-screen bg-[#FDFCFB] text-[#3D2B1F]" dir="rtl">
      <Toaster />

      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-l border-[#EBE3D5] sticky top-0 h-screen hidden md:flex flex-col">
        {/* بخش لوگو و بازگشت به خانه */}
        <div className="p-6 border-b border-[#F5F1EB] flex flex-col gap-6">
          <Link href="/" className="block transition-opacity hover:opacity-80">
            <Image
              className="max-lg:w-[158px] max-md:w-[118px]"
              width={191}
              height={23}
              src="/fill-font-img-svg-icon/images/Logo.svg.png"
              alt="logo"
              quality={100}
            />
          </Link>
        </div>

        {/* ناوبری */}
        <nav className="p-4 space-y-2 flex-1">
          <NavItem
            id="profile"
            label="پروفایل و امنیت"
            icon={<User size={18} />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <NavItem
            id="cart"
            label="سبد خرید"
            icon={<ShoppingBag size={18} />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            badge={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          />
          <NavItem
            id="comments"
            label="نظرات شما"
            icon={<MessageCircle size={18} />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            badge={commentData?.data.length}
          />
          <NavItem
            id="questions"
            label="پرسش و پاسخ"
            icon={<HelpCircle size={18} />}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            badge={questionData?.data.length}
          />
        </nav>

        {/* دکمه بازگشت سریع در پایین Sidebar (اختیاری) */}
        <div className="p-4 border-t border-[#F5F1EB]">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 text-gray-400 hover:text-[#3D2B1F] text-xs font-bold transition-colors"
          >
            <ArrowRight size={16} className="rotate-180" />
            برگشت به فروشگاه
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">
        {activeTab === "profile" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EBE3D5] flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-2 border-[#EBE3D5] overflow-hidden bg-[#FDFCFB] flex items-center justify-center">
                  {previewImage || userProfile?.img ? (
                    <Image width={100} height={100}
                      src={previewImage || userProfile?.img}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-gray-300" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 left-0 bg-white border border-[#EBE3D5] p-1.5 rounded-full text-[#3D2B1F] shadow-sm hover:bg-gray-50 cursor-pointer transition-transform hover:scale-110"
                >
                  <Camera size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setPreviewImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="space-y-1">
                <div className="text-xl font-bold text-[#3D2B1F]">
                  {userProfile?.firstname} {userProfile?.lastname}
                </div>
                <div className="text-sm text-gray-400">
                  نام کاربری: {userProfile?.username}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#EBE3D5]">
              <div className="flex items-center gap-2 mb-6 font-semibold text-[#3D2B1F]">
                <Lock size={18} className="text-[#B39371]" />
                <span>تغییر رمز عبور</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 relative">
                  <label className="text-xs text-gray-400 block mb-1">
                    رمز عبور فعلی
                  </label>
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      setErrors({ ...errors, currentPassword: "" });
                    }}
                    className={`w-full border ${
                      errors.currentPassword
                        ? "border-red-400"
                        : "border-[#EBE3D5]"
                    } p-3 rounded-xl bg-[#FDFCFB] outline-none text-sm focus:border-[#B39371] transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute left-3 top-8 text-gray-400 hover:text-[#3D2B1F] cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.currentPassword && (
                    <p className="text-[10px] text-red-500 mt-1 mr-1">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({ ...errors, newPassword: "" });
                    }}
                    className={`w-full border ${
                      errors.newPassword ? "border-red-400" : "border-[#EBE3D5]"
                    } p-3 rounded-xl bg-[#FDFCFB] outline-none text-sm focus:border-[#B39371]`}
                  />
                  {errors.newPassword && (
                    <p className="text-[10px] text-red-500 mt-1 mr-1">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    تکرار رمز عبور جدید
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: "" });
                    }}
                    className={`w-full border ${
                      errors.confirmPassword
                        ? "border-red-400"
                        : "border-[#EBE3D5]"
                    } p-3 rounded-xl bg-[#FDFCFB] outline-none text-sm focus:border-[#B39371]`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-[10px] text-red-500 mt-1 mr-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={updateMutation.isPending}
                className="mt-6 bg-[#3D2B1F] text-white px-8 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              >
                {updateMutation.isPending && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                ذخیره تغییرات نهایی
              </button>
            </div>
          </div>
        )}

        {activeTab === "comments" && (
          <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-[#3D2B1F] flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#B39371] rounded-full" />
                نظرات شما
              </h2>
              <span className="text-[10px] bg-[#F5F1EB] px-3 py-1 rounded-full text-[#B39371] font-bold">
                تعداد: {toPersianNumber(commentData?.data.length || 0)}
              </span>
            </div>

            {commentData?.data.length === 0 ? (
              <Empty text="نظری یافت نشد" />
            ) : (
              commentData?.data.map((c) => (
                <div
                  key={c._id}
                  className="group bg-white rounded-[1.5rem] border border-[#EBE3D5] overflow-hidden shadow-sm hover:border-[#B39371] transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${
                          c.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {c.isActive ? (
                          <>
                            <CheckCircle2 size={12} /> تایید شده
                          </>
                        ) : (
                          <>
                            <Clock size={12} /> در انتظار تایید
                          </>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 flex items-center gap-1 font-bold">
                        <Calendar size={10} />{" "}
                        {new Date(c.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <div className="mb-3 flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < c.rating ? "#B39371" : "none"}
                          className={
                            i < c.rating ? "text-[#B39371]" : "text-gray-200"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-sm text-[#3D2B1F] font-medium leading-relaxed mb-6">
                      {c.comment}
                    </p>

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-50">
                      <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-600 transition-colors">
                        <span className="text-[11px] font-bold">
                          {toPersianNumber(c.likes || 0)}
                        </span>
                        <ThumbsUp size={14} />
                      </button>
                      <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-600 transition-colors">
                        <span className="text-[11px] font-bold">
                          {toPersianNumber(c.dislikes || 0)}
                        </span>
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "questions" && (
          <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-[#3D2B1F] flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#B39371] rounded-full" />
                پرسش و پاسخ‌ها
              </h2>
              <span className="text-[10px] bg-[#F5F1EB] px-3 py-1 rounded-full text-[#B39371] font-bold">
                تعداد: {toPersianNumber(questionData?.data.length || 0)}
              </span>
            </div>

            {questionData?.data.length === 0 ? (
              <Empty text="هنوز سوالی نپرسیده‌اید" />
            ) : (
              questionData?.data.map((q) => (
                <div
                  key={q._id}
                  className="group bg-white rounded-[1.5rem] border border-[#EBE3D5] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${
                          q.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-orange-50 text-orange-600"
                        }`}
                      >
                        {q.isActive ? (
                          <>
                            <CheckCircle2 size={12} /> تایید شده
                          </>
                        ) : (
                          <>
                            <Clock size={12} /> در انتظار تایید
                          </>
                        )}
                      </div>
                      <span className="text-[9px] text-gray-400 flex items-center gap-1 font-bold">
                        <Calendar size={10} />{" "}
                        {new Date(q.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <div className="flex items-start gap-4 mb-5">
                      <div className="w-10 h-10 shrink-0 bg-[#3D2B1F] rounded-2xl flex items-center justify-center text-[#FDFCFB] shadow-lg shadow-gray-200">
                        <HelpCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-[#B39371] uppercase tracking-wider block mb-1">
                          پرسش شما
                        </span>
                        <p className="text-sm text-[#3D2B1F] font-bold leading-relaxed">
                          {q.question}
                        </p>
                      </div>
                    </div>

                    {q.answers.length > 0 ? (
                      <div className="relative mr-6 sm:mr-12 p-5 bg-[#FDFCFB] border border-[#F5F1EB] rounded-[1.2rem] flex items-start gap-3">
                        <div className="absolute -top-5 right-5 w-px h-5 bg-[#EBE3D5]" />
                        <div className="w-8 h-8 shrink-0 bg-[#B39371] rounded-xl flex items-center justify-center text-white">
                          <CornerDownLeft size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] flex items-center font-black text-[#3D2B1F]">
                              <p>پاسخ از طرف</p>
                              {q.answers[0].answeredBy.firstname}
                            </span>
                            <ShieldCheck size={12} className="text-[#B39371]" />
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed italic">
                            {q.answers[0].text}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mr-6 sm:mr-12 flex items-center gap-3 p-4 bg-orange-50/30 rounded-2xl border border-dashed border-orange-100">
                        <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                        <span className="text-[11px] text-orange-600 font-medium">
                          پاسخی وجود ندارد؛ به زودی توسط طراح سایت پاسخ داده
                          می‌شود.
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "cart" && (
          <div className="max-w-2xl space-y-4 animate-in fade-in duration-500">
            {/* هدر سبد خرید با نمایش مجموع کل کالاها */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-[#3D2B1F] flex items-center gap-2">
                <div className="w-1.5 h-6 bg-[#B39371] rounded-full" />
                سبد خرید شما
                <span className="mr-2 px-2.5 py-0.5 bg-[#F5F1EB] text-[#B39371] text-xs rounded-lg border border-[#EBE3D5]">
                  {toPersianNumber(
                    cartItems.reduce((acc, item) => acc + item.quantity, 0)
                  )}{" "}
                  کالا
                </span>
              </h2>
            </div>

            {cartItems.length === 0 ? (
              <Empty text="سبد خرید شما در حال حاضر خالی است" />
            ) : (
              <div className="bg-white rounded-3xl border border-[#EBE3D5] overflow-hidden shadow-sm transition-all hover:shadow-md">
                {/* لیست محصولات بدون اسکرول داخلی */}
                <div className="flex flex-col">
                  {cartItems.map((item) => (
                    <div
                      key={item.product._id}
                      className="p-6 flex items-center justify-between border-b border-[#F5F1EB] last:border-0 hover:bg-[#FDFCFB] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#F5F1EB] bg-gray-50 flex-shrink-0">
                          <Image
                            width={100}
                            height={100}
                            src={`/fill-font-img-svg-icon/images${
                              item.product.images?.[0] || ""
                            }`}
                            alt={item.product.title}
                            className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <h4 className="font-bold text-sm text-[#3D2B1F]">
                            {item.product.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-[#3D2B1F] text-white px-2 py-0.5 rounded-md font-bold">
                              {toPersianNumber(item.quantity)} عدد
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">
                              واحد:{" "}
                              {toPersianNumber(
                                item.product.price.toLocaleString()
                              )}{" "}
                              تومان
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="text-[10px] text-gray-400 mb-1 font-bold">
                          مجموع واحد
                        </div>
                        <div className="text-sm font-black text-[#B39371]">
                          {toPersianNumber(
                            (
                              item.product.price * item.quantity
                            ).toLocaleString()
                          )}{" "}
                          تومان
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* بخش نهایی و پرداخت */}
                <div className="p-8 bg-[#FDFCFB] border-t border-[#EBE3D5] flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 text-sm font-bold">
                        مبلغ قابل پرداخت نهایی
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-black text-[#3D2B1F]">
                        {toPersianNumber(totalPrice.toLocaleString())}{" "}
                        <span className="text-xs font-normal">تومان</span>
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-[#3D2B1F] text-white py-4 rounded-2xl font-black text-sm hover:bg-[#2A1D15] transition-all shadow-lg shadow-brown-100/30 flex items-center justify-center gap-3 group">
                    تایید نهایی و پرداخت آنلاین
                    <div className="bg-white/10 p-1 rounded-lg group-hover:bg-white/20 transition-colors">
                      <Clock size={18} />
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================
    COMPONENTS
========================= */
interface NavItemProps {
  id: TabType;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  activeTab: TabType;
  setActiveTab: (id: TabType) => void;
}

function NavItem({
  id,
  label,
  icon,
  badge = 0,
  activeTab,
  setActiveTab,
}: NavItemProps) {
  const active = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 cursor-pointer ${
        active
          ? "bg-[#FDFCFB] shadow-sm text-[#3D2B1F] border border-[#EBE3D5]"
          : "text-gray-400 hover:bg-gray-50 hover:text-[#3D2B1F]"
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      {badge > 0 && (
        <span
          className={`text-[10px] min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5 font-bold ${
            active ? "bg-[#3D2B1F] text-white" : "bg-[#B39371] text-white"
          }`}
        >
          {toPersianNumber(badge)}
        </span>
      )}
    </button>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-[#EBE3D5] text-gray-400">
      <MessageSquare size={32} className="mb-3 opacity-20" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
