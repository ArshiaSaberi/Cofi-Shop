"use client";

import Link from "next/link";
import Image from "next/image";
import { loginAction } from "../../../utils/authActions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import validator from "validator";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type LoginFormInputs = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await loginAction(formData);

      if (result.error) {
        toast.error(result.error, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        setLoading(false);
        return;
      } else {
        await toast.success("با موفقیت وارد شدید", {
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
      const sevenDaysInSeconds = 7 * 24 * 60 * 60;
      document.cookie = `token=${result.token}; path=/; Max-Age=${sevenDaysInSeconds}`;
      router.push("/");
    } catch {
      toast.error("خطایی رخ داد، دوباره تلاش کنید", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center px-[35px] justify-center py-4 min-h-screen flex-col gap-4 bg-[#E2DFD3]">
      <Link href="/">
        <Image
          width={191}
          height={52}
          src="/fill-font-img-svg-icon/images/Logo.svg.png"
          alt="logo"
          priority
        />
      </Link>

      <div className="w-full max-w-sm p-6 border border-chocolate-dark rounded-xl shadow bg-primry">
        <h2 className="text-xl font-bold text-center mb-4 text-slate-gray">
          ورود
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {/* ایمیل */}
          <input
            type="text"
            placeholder="ایمیل"
            className="border p-2 rounded-md border-chocolate-dark"
            {...register("email", {
              required: "ایمیل الزامی است",
              validate: (value) =>
                validator.isEmail(value) || "ایمیل معتبر نیست",
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* رمز عبور با چشم */}
          <div className="relative flex items-center">
            <span
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute left-2 cursor-pointer text-gray-500 select-none"
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
            </span>

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

          {/* دکمه ورود */}
          <button
            type="submit"
            disabled={loading || !isValid}
            className={`bg-sand-beige text-white cursor-pointer rounded-md py-2 ${
              loading || !isValid
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-sand-beige/90"
            }`}
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-slate-gray">
          اکانت نداری؟{" "}
          <Link href="/signup" className="text-blue-600 font-semibold">
            ثبت‌نام
          </Link>
        </p>
      </div>

      {/* ToastContainer باید یک بار اضافه شود */}
      <ToastContainer rtl />
    </div>
  );
}
