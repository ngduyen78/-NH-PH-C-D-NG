import React, { useState, useRef } from 'react';
import { Header, ActiveTab } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { RestorationStudio } from './components/RestorationStudio.tsx';
import { MemoryLibrary } from './components/MemoryLibrary.tsx';
import { MemorialMap } from './components/MemorialMap.tsx';
import { SearchMemorial } from './components/SearchMemorial.tsx';
import { SupportRequestModal } from './components/SupportRequestModal.tsx';
import { CandleTributeModal } from './components/CandleTribute.tsx';
import { Footer } from './components/Footer.tsx';
import { SamplePortrait } from './data/samples.ts';
import { Flame } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isCandleModalOpen, setIsCandleModalOpen] = useState(false);
  const globalFileInputRef = useRef<HTMLInputElement>(null);

  // Switch to restoration studio
  const handleStartRestore = (fileDataUrl?: string) => {
    if (fileDataUrl) {
      setUploadedImage(fileDataUrl);
    }
    setActiveTab('restore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Called when user clicks hero button "Đăng tải ảnh ngay"
  const handleHeroUploadClick = () => {
    setActiveTab('restore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (globalFileInputRef.current) {
      globalFileInputRef.current.click();
    }
  };

  const handleGlobalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        setUploadedImage(dataUrl);
        setActiveTab('restore');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  // Smooth scroll or switch to library
  const handleExploreMore = () => {
    setActiveTab('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPortraitToRestore = (_portrait: SamplePortrait) => {
    setActiveTab('restore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#140424] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Hidden persistent global file input that survives tab switches */}
      <input
        ref={globalFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleGlobalFileChange}
        className="hidden"
        id="persistent-hero-file-uploader"
      />

      {/* Header (Layout matches screenshot) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
        onOpenCandleModal={() => setIsCandleModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Tab: Trang Chủ (Home) */}
        {activeTab === 'home' && (
          <>
            <HeroSection
              onRequestUploadFile={handleHeroUploadClick}
              onStartRestore={() => handleStartRestore()}
              onUploadFile={(dataUrl) => handleStartRestore(dataUrl)}
            />

            {/* Studio Section directly accessible on Home */}
            <div className="border-t border-purple-900/40 bg-gradient-to-b from-[#140424] via-[#19062e] to-[#120320]">
              <RestorationStudio
                uploadedImage={uploadedImage}
                onClearUploadedImage={() => setUploadedImage(null)}
              />
            </div>

            {/* Memory Library */}
            <div className="border-t border-purple-900/40 bg-[#120320]">
              <MemoryLibrary onSelectToRestore={handleSelectPortraitToRestore} />
            </div>

            {/* Map */}
            <div className="border-t border-purple-900/40 bg-[#140424]">
              <MemorialMap />
            </div>

            {/* Search */}
            <div className="border-t border-purple-900/40 bg-[#120320]">
              <SearchMemorial />
            </div>
          </>
        )}

        {/* Tab: Phục Dựng Ảnh (Dedicated Restore Studio - No Hero Section blocking) */}
        {activeTab === 'restore' && (
          <div className="bg-gradient-to-b from-[#140424] via-[#19062e] to-[#120320] pt-6 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => {
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs text-purple-200 hover:text-amber-400 transition-colors font-semibold py-1.5 px-3.5 rounded-lg bg-purple-950/60 border border-purple-700/50 cursor-pointer"
              >
                <span>← Quay lại Trang Chủ</span>
              </button>

              <button
                onClick={handleHeroUploadClick}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 py-1.5 px-4 rounded-lg shadow-md shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
              >
                <span>Tải ảnh di ảnh mới từ máy tính</span>
              </button>
            </div>

            <RestorationStudio
              uploadedImage={uploadedImage}
              onClearUploadedImage={() => setUploadedImage(null)}
            />
          </div>
        )}

        {/* Tab: Thư Viện Ký Ức */}
        {activeTab === 'library' && (
          <div className="border-t border-purple-900/40 bg-[#120320] py-8">
            <MemoryLibrary onSelectToRestore={handleSelectPortraitToRestore} />
          </div>
        )}

        {/* Tab: Bản Đồ Kết Nối */}
        {activeTab === 'map' && (
          <div className="border-t border-purple-900/40 bg-[#140424] py-8">
            <MemorialMap />
          </div>
        )}

        {/* Tab: Tìm Kiếm */}
        {activeTab === 'search' && (
          <div className="border-t border-purple-900/40 bg-[#120320] py-8">
            <SearchMemorial />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTab={setActiveTab}
        onOpenSupportModal={() => setIsSupportModalOpen(true)}
        onOpenCandleModal={() => setIsCandleModalOpen(true)}
      />

      {/* Floating Candle Tribute Button */}
      <button
        onClick={() => setIsCandleModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-2xl shadow-amber-500/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
        title="Thắp một nén nhang / ngọn nến tri ân"
      >
        <Flame className="w-6 h-6 fill-slate-950 text-slate-950 animate-pulse" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2">
          Thắp nến tri ân
        </span>
      </button>

      {/* Support & Free Restoration Request Modal */}
      <SupportRequestModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Candle Ceremony Modal */}
      <CandleTributeModal
        isOpen={isCandleModalOpen}
        onClose={() => setIsCandleModalOpen(false)}
      />
    </div>
  );
}
