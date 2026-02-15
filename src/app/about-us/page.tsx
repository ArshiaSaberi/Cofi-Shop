// app/about/page.tsx
import Footer from "@componnt/templates/footer";
import Header from "@componnt/templates/header";
import Image from "next/image";

export default function About() {
  return (
    <>

      <div className="containers overflow-x-hidden">
        <Header />

        <main className="mt-[166px] max-[401px]:mt-[127px] ">
          {/* Stats Section */}

          <div className="flex items-center justify-evenly flex-wrap max-[670px]:flex-col-reverse my-10 mt-50 gap-8">
             <p className="w-3/5 text-justify">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
              استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله
              در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد
              نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد،
              کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان
              جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای
              طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان
              فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری
              موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد
              نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل
              دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
            </p>
            <div className="">
              <Image
                src="/fill-font-img-svg-icon/images/downloadaboutpng.png"
                alt="توضیح تصویر"
                width={200}
                height={200}
                 quality={100} 
              />
            </div>
           
          </div>

          <div className="flex flex-wrap justify-center items-center gap-10 bg-[#f5f3ee] py-[60px] w-full">
            {[
              { number: "100+", label: "نوع قهوه" },
              { number: "1000+", label: "مشتری راضی" },
              { number: "3+", label: "شعبه" },
              { number: "100+", label: "اکسسوری" },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white shadow-md rounded-3xl w-[160px] h-[160px] justify-center hover:scale-105 transition-all duration-200 hover:bg-sandstone "
              >
                <p className="text-4xl text-coffee-brown font-bold">
                  {stat.number}
                </p>
                <p className="text-gray-700 text-lg mt-2">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Vision Section */}
          <div className="flex flex-col items-center text-center my-[80px] px-5 max-lg:px-3">
            <p className="text-3xl font-bold text-dark-charcoal mb-4">
              چشم انداز ما
            </p>
            <p className="text-lg max-w-[700px] leading-8 max-md:text-base">
              ایجاد تجربه‌ای بی‌نظیر از قهوه برای همه مشتریانمان، توسعه برندهای
              معتبر و ارائه بهترین خدمات آموزشی در زمینه قهوه و فرهنگ
              کافه‌نشینی.
            </p>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
