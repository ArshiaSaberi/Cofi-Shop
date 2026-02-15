export default function Loading() {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm z-[9999]">
  
        {/* حلقه نورانی سه‌بعدی */}
        <div className="w-20 h-20 border-4 border-gray-600 border-t-transparent border-l-transparent rounded-full animate-spin shadow-[0_0_25px_#c9a96b]"></div>
  
        {/* متن همراه با انیمیشن نقطه‌ای */}
        <p className="mt-6 text-[#c9a96b] text-xl font-semibold flex items-center gap-1">
          در حال بارگذاری
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-150">.</span>
          <span className="animate-bounce delay-300">.</span>
        </p>
      </div>
    );
  }
  