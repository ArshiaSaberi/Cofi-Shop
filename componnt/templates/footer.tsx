import Image from "next/image";

export default function Footer(){
    return(
         <footer className="mt-auto">
                <div className="bg-charcoal w-screen ">
                  <div className="containers">
                    <div className="pt-10 pb-[30px] flex items-center justify-around flex-wrap gap-[30px] ">
                      <div className="flex items-center justify-center lg:m-auto max-lg:ml-auto">
                        <div className="bg-sandstone w-[70px] h-[70px]  max-[400px]:max-w-[60px] max-[400px]:max-h-[60px] flex items-center justify-center rounded-full">
                          <svg className="w-[35px] h-[35px]">
                            <use href="#3"></use>
                          </svg>
                        </div>
                        <div className="mr-[10px]">
                          <p className="text-white text-[22px]">تلفن تماس:</p>
                          <p className="text-Yekan text-[#A1A1A1] text-[18px]">
                            09213025141
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center lg:m-auto max-lg:ml-auto">
                        <div className="bg-sandstone w-[70px] h-[70px] flex items-center justify-center rounded-full max-[400px]:max-w-[60px] max-[400px]:max-h-[60px] max-[300px]:max-w-[50px] max-[300px]:max-h-[50px]">
                          <svg className="w-[26.5px] h-[35px]">
                            <use href="#1"></use>
                          </svg>
                        </div>
                        <div className="mr-[10px]">
                          <p className="text-white text-[22px]"> آدرس:</p>
                          <p className="text-Yekan text-[#A1A1A1] text-[18px]">
                            جاده چالوس ، رشت ، رادیو دریا 2
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center lg:m-auto max-lg:ml-auto">
                        <div className="bg-sandstone w-[70px] h-[70px] flex items-center justify-center rounded-full max-[400px]:max-w-[60px] max-[400px]:max-h-[60px]">
                          <svg className="w-[35px] h-[35px]">
                            <use href="#2"></use>
                          </svg>
                        </div>
                        <div className="mr-[10px]">
                          <p className="text-white text-[22px]"> ساعات کاری:</p>
                          <p className="text-Yekan text-[#A1A1A1] text-[18px]">
                            8 صبح الی 11 شب
                          </p>
                        </div>
                      </div>
                    </div>
                    <span className="w-full h-[1px] bg-[#525252] border border-[#525252] block mt-[70px] max-sm:mt-[42px] mb-[42px]"></span>
                    <div className="flex items-center justify-around max-md:flex-col">
                      <Image
                        className=""
                        width={191}
                        height={62}
                        src="/fill-font-img-svg-icon/images/khkh.png"
                        alt=""
                      />
                      <div className="text-[#FFFFFF] leading-[20px] flex items-center justify-center mt-[27px] mb-[20px] *:text-lg max-[350px]:*:text-[15px] max-[350px]:*:max-w-[88px]">
                        <div className="w-[128px] h-[46px] flex items-center justify-center gap-2 max-[843px]:max-w-[100px]">
                          <p className="w-[70px] h-[25px] mt-[8px]">محصولات</p>{" "}
                          <svg className="w-[10px] h-[16px] mt-[16px]">
                            <use href="#6"></use>
                          </svg>
                        </div>
                        <div className="w-[128px] h-[46px] flex items-center justify-center max-[843px]:max-w-[100px]">
                          درباره ما
                        </div>
                        <div className="w-[128px] h-[46px] flex items-center justify-center max-[843px]:max-w-[100px]">
                          تماس با ما
                        </div>
                      </div>
                      <div className="flex items-center justify-center lg:gap-[5px] max-lg:gap-[18px]">
                        <div className="w-[48px] h-[48px] flex items-center justify-center bg-[#434343] rounded-full">
                          <svg className="w-[21px] h-[24px]">
                            <use href="#33"></use>
                          </svg>
                        </div>
                        <div className="w-[48px] h-[48px] flex items-center justify-center bg-[#434343] rounded-full">
                          <svg className="w-[22px] h-[24px]">
                            <use href="#4"></use>
                          </svg>
                        </div>
                        <div className="w-[48px] h-[48px] flex items-center justify-center bg-[#434343] rounded-full">
                          <svg className="w-[23px] h-[24px]">
                            <use href="#5"></use>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mx-[94px] mt-[48px] pb-[30px] max-md:flex-col gap-[21px] max-[400px]:gap-[42px]">
                      <p className="w-[360.75px] h-[24px] text-[#A1A1A1] text-[15px] leading-[24px] max-md:text-center max-[400px]:w-[230px]">
                        تمام حقوق این سایت متعلق به خانه قهوه چالوس میباشد
                      </p>
                      <Image
                        width={63}
                        height={63}
                        src="/fill-font-img-svg-icon/images/E.png"
                        alt=""
                        className=" min-w-[63px] min-h-[63px]"
                      />
                    </div>
                  </div>
                </div>
              </footer>
    )
}