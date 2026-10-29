import React, { useRef } from 'react';
import { UploadCloud, Star, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onStartRestore: () => void;
  onUploadFile?: (dataUrl: string) => void;
  onRequestUploadFile?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartRestore,
  onUploadFile,
  onRequestUploadFile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onRequestUploadFile) {
      onRequestUploadFile();
    } else {
      onStartRestore();
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadFile) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        onUploadFile(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="relative overflow-hidden bg-deep-memorial starry-overlay pt-16 pb-20 lg:pt-24 lg:pb-28">
      {/* Hidden file input for instant file selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="hero-file-uploader"
      />

      {/* Multi-layered Royal Purple Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[480px] bg-purple-700/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/5 w-[420px] h-[300px] bg-fuchsia-600/15 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/5 w-[400px] h-[280px] bg-amber-500/12 rounded-full blur-[100px] pointer-events-none" />

      {/* Sparkling Starlight Points */}
      <div className="absolute top-8 left-[12%] text-amber-300 twinkle-star-1 pointer-events-none">
        <Star className="w-4 h-4 fill-amber-300 opacity-80" />
      </div>
      <div className="absolute top-16 right-[15%] text-white twinkle-star-2 pointer-events-none">
        <Star className="w-3.5 h-3.5 fill-white opacity-85" />
      </div>
      <div className="absolute top-28 left-[28%] text-amber-200 twinkle-star-3 pointer-events-none">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_8px_#fde047]" />
      </div>
      <div className="absolute top-12 right-[32%] text-white twinkle-star-1 pointer-events-none">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
      </div>
      <div className="absolute top-44 left-[8%] text-purple-200 twinkle-star-2 pointer-events-none">
        <Star className="w-3 h-3 fill-purple-200 opacity-70" />
      </div>
      <div className="absolute top-36 right-[8%] text-amber-300 twinkle-star-3 pointer-events-none">
        <Star className="w-4 h-4 fill-amber-300 opacity-80" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Capsule Badge (Huy hiệu capsule bo circle: HÀNH TRÌNH SỐ – QUẢNG TRỊ MY LOVE) */}
        <div className="inline-flex items-center justify-center mb-8">
          <div className="hero-capsule px-6 py-2 sm:px-8 sm:py-2.5 rounded-full border border-purple-400/30 bg-purple-950/40 backdrop-blur-md shadow-xl flex items-center gap-2.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold tracking-[0.22em] text-slate-100 uppercase">
              HÀNH TRÌNH SỐ – QUẢNG TRỊ MY LOVE
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase leading-none mb-6">
          <span className="text-amber-400 drop-shadow-[0_4px_28px_rgba(251,191,36,0.5)]">
            NHỮNG GƯƠNG MẶT BẤT TỬ
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl md:text-2xl font-normal tracking-[0.25em] text-slate-200 uppercase mb-12 max-w-3xl mx-auto">
          THẮP SÁNG KÝ ỨC – SÁNG MÃI TÊN ANH
        </p>

        {/* 1 Link duy nhất liên kết để tạo phục dựng ảnh */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleButtonClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4.5 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-base sm:text-lg transition-all duration-200 shadow-2xl shadow-amber-500/35 hover:shadow-amber-500/50 cursor-pointer"
          >
            <UploadCloud className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span>Đăng tải ảnh ngay</span>
          </button>
        </div>
      </div>
    </section>
  );
};
