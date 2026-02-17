// import localFont from "next/font/local";
import Image from "next/image";
import Categorization from "../../componnt/modules/categorization";
import { productCategories } from "../../utils/categori/db";
import { Articl } from "../../componnt/modules/Articles";
import { Articls } from "../../componnt/modules/swiper";
import Link from "next/link";
import Header from "../../componnt/templates/header";
import { NewProductslider } from "../../componnt/modules/newprodoucts";
import { NewProductsliderDiscount } from "../../componnt/modules/newproductssliderdiscount";
import React from "react";

const FooterLazy = React.lazy(() => import("@componnt/templates/footer"));
const BrandLazy = React.lazy(() => import("@componnt/modules/brand"));

export default function Home() {
  return (
    <>
      <div className="containers overflow-x-hidden">
        <Header></Header>
        <main className="maim mt-[166px] max-[401px]:mt-[127px] flex items-center justify-center flex-col">
          {/* header */}
          <div className="flex items-center justify-center mt-5">
            <p className="text-[25px] min-[321px]:text-[35px] min-[401px]:text-[45px] min-[769px]:text-[65px] min-[1025px]:text-[85px] text-coffee-brown font-bold">
              قهوت
            </p>
            <p className="text-[25px] min-[321px]:text-[35px] min-[401px]:text-[45px] min-[769px]:text-[65px] min-[1025px]:text-[75px] text-blak leading-[85px]">
              یـادت نـره!
            </p>
          </div>
          <div className="text-blak text-xl mt-[28px] mb-[40px] max-lg:leading-[20px] text-center leading-7 max-lg:text-lg max-md:text-base">
            بهترین و با کیفیت ترین قهوه ها و اکسسوری ها در خانه قهوه چالوس
          </div>
          <Link href={"/products"}>
            <div className="text-white border border-sandstone bg-sandstone w-[216px] h-[48px] rounded-[100px] text-xl flex items-center justify-center gap-2 cursor-pointer">
              نمایش محصولات
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5} // <-- اصلاح شد
                stroke="currentColor"
                className="w-6 h-6" // اگر Tailwind استفاده می‌کنید
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
            </div>
          </Link>
          <div className="bg-header relative bg-cover bg-center bg-no-repeat w-[800px] h-[435px] mt-10  max-2xl:w-[650px] max-2xl:h-[390px] max-lg:w-[550px] max-lg:h-[350px]  max-md:w-[450px] max-md:h-[300px] max-sm:w-[340px] max-sm:h-[240px] max-[400px]:max-w-[220px]">
            <div className="bg-headerbg w-[1150px] h-[179px] absolute bg-cover bg-center bg-no-repeat -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-xl:w-[700px] max-xl:h-[108px] max-md:h-[70px] max-md:w-[452px] max-[550px]:max-w-[281px] max-[550px]:max-h-[44px] max-[370px]:max-w-[231px] max-[370px]:max-h-[35px]"></div>
            <div className="bg-[#E2DFD5] absolute w-[950px] h-[155px] border-[#E2DFD5] rounded-[100px] flex max-md:flex-wrap max-md:flex-col items-center justify-around max-lg:justify-evenly bg-bg top-[102%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-lg:top-[104%] max-md:top-[126%] max-sm:top-[139%] max-lg:w-[662px] max-md:h-[256px] max-md:w-[535px] max-sm:w-[400px] max-sm:h-[269px] max-[550px]:!top-[125%]  max-[550px]:max-w-[360px] max-[550px]:max-h-[204px] max-[550px]:!justify-center max-[400px]:max-w-[285px] max-[400px]:min-h-[316px] max-[400px]:!top-[135%]">
              <div className="flex items-center justify-center flex-col">
                <p className="text-[70px] text-coffee-brown text-Yekan  max-lg:text-[50px] max-lg:leading-[50px] max-[550px]:!text-[35px]">
                  100+
                </p>
                <p className="text-[#3D3D3D] text-[30px]  max-lg:text-[25px] max-[550px]:!text-[18px]">
                  نوع قهوه
                </p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <p className="text-[70px] text-coffee-brown text-Yekan  max-lg:text-[50px] max-lg:leading-[50px] max-[550px]:!text-[35px]">
                  1000+
                </p>
                <p className="text-[#3D3D3D] text-[30px] max-lg:text-[25px] max-[550px]:!text-[18px]">
                  مشتری راضی
                </p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <p className="text-[70px] text-coffee-brown text-Yekan  max-lg:text-[50px] max-lg:leading-[50px] max-[550px]:!text-[35px]">
                  {" "}
                  3+
                </p>
                <p className="text-[#3D3D3D] text-[30px] max-lg:text-[25px] max-[550px]:!text-[18px]">
                  شعبه
                </p>
              </div>
              <div className="flex items-center justify-center flex-col">
                <p className="text-[70px] text-coffee-brown text-Yekan  max-lg:text-[50px] max-lg:leading-[50px] max-[550px]:!text-[35px]">
                  100+
                </p>
                <p className="text-[#3D3D3D] text-[30px] max-lg:text-[25px] max-[550px]:!text-[18px]">
                  اکسسوری
                </p>
              </div>
            </div>
          </div>
          {/* categorization */}
          <div className="mt-[156px] max-md:mt-[270px] max-sm:mt-[280px] flex justify-center items-center flex-col max-[550px]:!mt-[210px] max-[400px]:!mt-[300px]">
            <Image
              src="/fill-font-img-svg-icon/images/Group1.png"
              alt="categorization"
              width={71}
              height={59}
            />
            <div
              className="text-dark-charcoal text-4xl mt-[12px] mb-[13px] font-bold leading-[50px] text-IRANSansWeb_Bold relative  after:bg-[#0000001B] after:h-[1px] after:absolute after:w-[400px] after:top-0 after:bottom-0 after:m-auto after:mr-5
             before:bg-[#0000001B] before:h-[1px] before:absolute before:w-[400px] before:top-0 before:right-[-400px] before:bottom-0 before:m-auto before:mr-[-20px] max-sm:text-[30px] max-[400px]:!text-[28px]"
            >
              دسته بندی محصولات
            </div>
            <p className="mt-3 font-bold mb-[64px] text-slate-gray text-lg leading-[28px] max-sm:text-base text-center">
              بهترین و باکیفیت ترین برند ها ، چون شما لایق بهترین ها هستید
            </p>
            <div className="flex items-center justify-center flex-wrap">
              {productCategories.map((product) => (
                <Categorization {...product} key={product.id} />
              ))}
            </div>
          </div>

          {/* Newest Products */}
          <div className="bg-[#E2DFD3] w-screen flex items-center justify-center flex-col pt-[30px] mt-[147px]">
            <Image
              src="/fill-font-img-svg-icon/images/Group1.png"
              alt="categorization"
              width={71}
              height={59}
            />
            <p className="text-coffee-brown text-4xl mt-[6px] mb-[13px]">
              جدیدترین محصولات
            </p>

            <NewProductslider></NewProductslider>
          </div>

          {/* Brand */}

          <div className="mt-[56px] flex items-center justify-between flex-col w-full">
            <Image
              src="/fill-font-img-svg-icon/images/Group1.png"
              alt="categorization"
              width={71}
              height={59}
            />
            <p className="text-dark-charcoal text-4xl mt-[12px] mb-[13px] font-bold leading-[50px] text-IRANSansWeb_Bold max-[500px]:text-2xl max-[300px]:text-center max-[400px]:!text-[28px]">
              قهوه ها بر اساس برند
            </p>
            <p className="text-slate-gray text-lg leading-[28px] font-bold max-[500px]:text-base max-[300px]:text-center">
              بر اساس برند مورد علاقتان انتخاب کنید
            </p>
            <BrandLazy></BrandLazy>
          </div>

          {/* Discount */}

          <div className="bg-[#E2DFD3] w-screen flex items-center justify-center flex-col pt-[30px] mt-[147px]">
            <Image
              src="/fill-font-img-svg-icon/images/Group1.png"
              alt="categorization"
              width={71}
              height={59}
            />
            <p className="text-coffee-brown text-4xl mt-[6px] mb-[13px]">
              تخفیف دار ها{" "}
            </p>

            <NewProductsliderDiscount></NewProductsliderDiscount>
          </div>

          {/* caption */}

          <div className="flex items-center w-full  justify-around max-md:flex-col-reverse">
            <div className="flex items-center justify-center flex-col ml-[1rem]">
              <div className="flex items-center justify-center ml-auto pb-[29px] max-md:m-auto max-[480px]:flex-col">
                <p className="text-dark-charcoal leading-[67px] font-bold text-[42px] max-[1100px]:text-[32px]">
                  خـــانه قـهــوه{" "}
                </p>
                <p className="text-dark-charcoal text-IRANSansWeb_Light leading-[67px] text-[42px] max-[1100px]:text-[32px] max-lg:text-sand-beige">
                  چـــالوس☕
                </p>
              </div>
              <p
                className="min:text-xl text-lg leading-[35px] max-md:!max-h-[111px] h-[111px] max-w-[722px] mb-[22px] max-[1093px]:mb-11 max-[933px]:mb-8 max-[848px]:max-h-[210px] max-[848px]:!mb-11 
              max-[600px]:!mb-28 max-[350px]:max-w-[200px] max-[350px]:!mb-[220px] max-[847px]:pb-[135px] text-justify"
              >
                با بیش از ده سال تجربه در اداره کافه‌ها و رستوران‌ها، و پنج سال
                سابقه در عرصه‌ی آموزش و تولید و فروش قهوه، ما در زمینه‌ی خدمات
                قهوه به شما اطمینان می‌دهیم. تخصص ما در ترکیب بی‌نظیر علم قهوه
                با تجربه رستورانی، تجربه‌ی بی‌نظیری را برای شما ایجاد خواهیم
                کرد.
              </p>
              <Link
                href={"/about-us"}
                className="text-white border border-sandstone bg-sandstone rounded-[100px] text-[20px] leading-[20px] w-[140px] h-[50px] flex items-center justify-center ml-auto mb-[64px] mt-[20px] max-[1094px]:mt-[45px] max-[787px]:mt-[100px] max-[933px]:mt-[45px] max-md:mt-0 max-[450px]:!mt-[70px] max-md:m-auto max-md:mb-[50px] max-[500px]:mb-[64px] "
              >
                درباره ما
              </Link>
            </div>
            <div className="border-[3px] border-slate-gray rounded-[8000px] md:min-w-[333px] md:min-h-[572px] p-[13px] my-[60px] relative w-[300px] h-[513px]">
              <Image
                className="rounded-[8000px] "
                src="/fill-font-img-svg-icon/images/07123b235b0337e9da9005ecca2de9a058ced12e.png"
                alt="categorization"
                width={307}
                height={546}
              />
              <Image
                className="absolute inset-0 m-auto"
                src="/fill-font-img-svg-icon/images/Button.png"
                alt="categorization"
                width={100}
                height={100}
              />
              <Image
                className="left-[-103] rounded-[8000px] absolute top-[-75px] md:right-[-103px]  max-[900px]:hidden max-md:flex max-[517px]:!hidden"
                src="/fill-font-img-svg-icon/images/Container.png"
                alt="categorization"
                width={103}
                height={309}
              />
            </div>
          </div>

          {/* Articles */}

          <div className=" bg-[#E2DFD3] w-screen ">
            <div className="containers">
              <div className="flex items-center justify-between flex-col">
                <Image
                  className="mt-[28px]"
                  src="/fill-font-img-svg-icon/images/Group1.png"
                  alt="categorization"
                  width={71}
                  height={59}
                />
                <p
                  className="text-dark-charcoal relative text-4xl mt-[12px] mb-[13px] font-bold leading-[50px] text-IRANSansWeb_Bold after:bg-[#0000001B] after:h-[1px] after:absolute after:w-[502px] after:top-0 after:bottom-0 after:m-auto after:mr-5
             before:bg-[#0000001B] before:h-[1px] before:absolute before:w-[502px] before:top-0 before:right-[-502px] before:bottom-0 before:m-auto before:mr-[-20px]"
                >
                  مقالات آموزشی
                </p>
                <p className="text-slate-gray text-lg leading-[28px] font-bold mb-[50px] relative text-center">
                  مقالات و آموزش های خانه قهوه چالـــوس
                  <Image
                    className="absolute left-[-262px] top-[-120px] max-md:hidden max-lg:left-[-175px]"
                    src="/fill-font-img-svg-icon/images/SVG.png"
                    alt=""
                    width={50}
                    height={50}
                  />
                  <Image
                    className="absolute right-[-262px] top-0 max-md:hidden max-lg:right-[-175px]"
                    src="/fill-font-img-svg-icon/images/SVG.png"
                    alt=""
                    width={50}
                    height={50}
                  />
                </p>
                <Articls />
                <Articl />
              </div>
            </div>
          </div>

          {/* Instagram */}

          <div className="flex items-center justify-between mt-[71px] max-lg:flex-col ">
            <div className="flex items-center justify-center flex-col">
              <div
                className="flex items-center mb-[17px] ml-auto max-lg:m-auto 
              "
              >
                <p className="text-[45px] max-[550px]:!text-3xl max-lg:m-auto text-sandstone leading-[67px] ml-auto">
                  ایـنستـاگــرام{" "}
                </p>
                <p className="text-[45px] max-[550px]:!text-3xl leading-[67px]ml-auto">
                  مـــا
                </p>
              </div>
              <div
                className="text-charcoal max-lg:m-auto ml-[226px] font-bold leading-[67px] text-[45px]  max-[550px]:text-3xl
               max-[310px]:text-2xl"
              >
                @Coffeehouse_north
              </div>
            </div>
            <div>
              <Image
                className="mt-[45px]"
                src="/fill-font-img-svg-icon/images/Instagram.png"
                alt="categorization"
                width={300}
                height={340}
              />
            </div>
          </div>
        </main>
      </div>
      <FooterLazy />
    </>
  );
}
