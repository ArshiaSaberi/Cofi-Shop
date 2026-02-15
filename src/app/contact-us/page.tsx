"use client";
import React, { useState } from "react";
import Header from "../../../componnt/templates/header";
import Footer from "../../../componnt/templates/footer";

export default function ContactUs() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // مدیریت مقادیر اینپوت‌ها
  const [formData, setFormData] = useState({
    subject: "",
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);

      // خالی کردن تمامی اینپوت‌ها بعد از ارسال موفق
      setFormData({
        subject: "",
        fullName: "",
        email: "",
        phone: "",
        message: "",
      });

      setTimeout(() => setIsSent(false), 5000);
    }, 2000);
  };

  return (
    <>
      <div className="min-h-screen bg-transparent">
        <Header />

        <main className="mt-[180px] mb-24 max-w-[900px] mx-auto px-6">
          <section className="text-center mb-16">
            <h1 className="text-3xl font-black text-[#4a2c2a] mb-4">
              ارتباط با خانه قهوه
            </h1>
            <div className="flex justify-center items-center gap-2 mb-6">
              <span className="w-10 h-[1px] bg-[#8d6e63]"></span>
              <span className="text-[#8d6e63]">☕</span>
              <span className="w-10 h-[1px] bg-[#8d6e63]"></span>
            </div>
            <p className="text-gray-500 text-base leading-8 max-w-xl mx-auto">
              پیام شما مستقیماً توسط طراح سایت بررسی می‌شود. نظرات و
              پیشنهادات خود را از طریق فرم زیر با ما در میان بگذارید.
            </p>
          </section>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* موضوع پیام */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#5d4037] mr-1">
                  موضوع پیام
                </label>
                <div className="relative group">
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-[#8d6e63] transition-all text-gray-700 cursor-pointer appearance-none"
                  >
                
                    <option className="cursor-pointer py-2" value="design">
                      ارتباط با طراح سایت
                    </option>
                    <option className="cursor-pointer py-2" value="support">
                     ایده ی جدید درباره ی سایت
                    </option>
                    <option className="cursor-pointer py-2" value="other">
                      سایر موارد
                    </option>
                  </select>

                  {/* آیکون فلش در سمت چپ */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-[#8d6e63]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* نام و نام خانوادگی */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#5d4037] mr-1">
                  نام و نام خانوادگی
                </label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  type="text"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-[#8d6e63] transition-colors"
                />
              </div>

              {/* ایمیل */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#5d4037] mr-1">
                  آدرس ایمیل
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-[#8d6e63] transition-colors text-left dir-ltr"
                />
              </div>

              {/* شماره تماس */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#5d4037] mr-1">
                  شماره تماس
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 outline-none focus:border-[#8d6e63] transition-colors text-left dir-ltr"
                />
              </div>

              {/* متن پیام */}
              <div className="md:col-span-2 flex flex-col gap-3">
                <label className="text-sm font-bold text-[#5d4037] mr-1">
                  متن پیام
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 outline-none focus:border-[#8d6e63] transition-all resize-none leading-8"
                ></textarea>
              </div>

              {/* بخش آپلود تصویر */}
              <div className="md:col-span-2">
                <label className="group block border-2 border-dashed border-[#E8E2DE] hover:border-[#8d6e63] bg-[#FCFAF8] rounded-[30px] p-8 text-center cursor-pointer transition-all">
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <svg
                        className="w-6 h-6 text-[#8d6e63]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    </div>
                    <span className="text-base font-bold text-[#4a2c2a]"> 
                      افزودن تصویر
                      (اختیاری ) 
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full md:w-80 py-4 rounded-xl font-bold text-lg transition-all cursor-pointer transform active:scale-95 shadow-sm
                  ${
                    isSubmitting
                      ? "bg-gray-200 text-gray-500 cursor-wait"
                      : "bg-[#d6cfc1] hover:bg-[#c1ae9b] text-[#4a2c2a]"
                  }`}
              >
                {isSubmitting ? "در حال ارسال..." : "ارسال پیام"}
              </button>
            </div>

            {isSent && (
              <p className="text-center text-green-600 font-bold text-sm mt-4 animate-fade-in">
                ✓ پیام شما با موفقیت ثبت شد.
              </p>
            )}
          </form>
        </main>
        <Footer />
      </div>
    </>
  );
}
