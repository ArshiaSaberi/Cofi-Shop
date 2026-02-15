"use client";

import Link from "next/link";
import Image from "next/image";
import { signupAction } from "../../../utils/authActions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";

type SignupFormInputs = {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupFormInputs>({ mode: "onChange" });

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setLoading(true);
    setSubmitError(null);

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await signupAction(formData);

      if (result.error) {
        setSubmitError(result.error);
        setLoading(false);
        return;
      }

      document.cookie = `token=${result.token}; path=/`;
      router.push("/");
    } catch {
      setSubmitError("خطایی رخ داد، دوباره تلاش کنید");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center px-[35px] justify-center py-8 min-h-screen gap-4 flex-col bg-[#E2DFD3]">
      <Link href="/">
        <Image
          width={191}
          height={52}
          src="/fill-font-img-svg-icon/images/Logo.svg.png"
          alt="logo"
          priority
        />
      </Link>

      <div className="w-full max-w-sm mx-auto p-6 border rounded-xl shadow bg-primry border-chocolate-dark">
        <h2 className="text-xl font-bold text-center mb-4 text-slate-gray">
          ثبت‌نام
        </h2>

        {submitError && (
          <div className="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {submitError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {/* نام کاربری */}
          <input
            type="text"
            placeholder="نام کاربری"
            className="border p-2 rounded-md border-chocolate-dark"
            {...register("username", {
              required: "نام کاربری الزامی است",
              minLength: {
                value: 2,
                message: "نام کاربری باید حداقل ۲ کاراکتر باشد",
              },
              maxLength:{
                value: 20,
                message: "نام کاربری باید حداکثر 20 کاراکتر باشد",
              }
            })}
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
          {/* نام */}
          <input
            type="text"
            placeholder="نام"
            className="border p-2 rounded-md border-chocolate-dark"
            {...register("firstname", {
              required: "نام الزامی است",
              validate: (value) => {
                if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(value)) {
                  return "نام باید فقط حروف باشد"; // اول چک حروف
                }
                if (value.length < 2) {
                  return "نام باید حداقل ۲ کاراکتر باشد"; // بعد چک طول
                }
                
                return true;
              },
            })}
          />
          {errors.firstname && (
            <p className="text-red-500 text-sm">{errors.firstname.message}</p>
          )}

          {/* نام خانوادگی */}
          <input
            type="text"
            placeholder="نام خانوادگی"
            className="border p-2 rounded-md border-chocolate-dark"
            {...register("lastname", {
              required: "نام خانوادگی الزامی است",
              validate: (value) => {
                if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(value)) {
                  return "نام خانوادگی باید فقط حروف باشد"; // اول چک حروف
                }
                if (value.length < 2) {
                  return "نام خانوادگی باید حداقل ۲ کاراکتر باشد"; // بعد چک طول
                }
                return true;
              },
            })}
          />
          {errors.lastname && (
            <p className="text-red-500 text-sm">{errors.lastname.message}</p>
          )}

          {/* ایمیل */}
          <input
            type="email"
            placeholder="ایمیل"
            className="border p-2 rounded-md border-chocolate-dark"
            {...register("email", {
              required: "ایمیل الزامی است",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "ایمیل معتبر نیست",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* پسورد با چشم */}
          <div className="relative flex items-center ">
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute cursor-pointer left-2 text-gray-500 cu"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                  />
                </svg>
              )}
            </button>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="رمز عبور"
              className="border p-2 rounded-md border-chocolate-dark w-full pl-10"
              {...register("password", {
                required: "رمز عبور الزامی است",
                minLength: {
                  value: 6,
                  message: "رمز باید حداقل ۶ کاراکتر باشد",
                },
                validate: (value) =>
                  /\d/.test(value) || "رمز عبور باید شامل حداقل یک عدد باشد",
              })}
            />
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* دکمه ثبت‌نام */}
          <button
            type="submit"
            disabled={loading || !isValid}
            className={`bg-sand-beige cursor-pointer text-white rounded-md py-2 ${
              loading || !isValid
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-sand-beige/90"
            }`}
          >
            {loading ? "در حال ثبت‌نام..." : "ایجاد حساب"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-slate-gray">
          اکانت داری؟{" "}
          <Link href="/login" className="text-blue-600 font-semibold">
            ورود
          </Link>
        </p>
      </div>
    </div>
  );
}
