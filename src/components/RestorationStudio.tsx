import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Sparkles,
  Sliders,
  Download,
  RotateCcw,
  Bot,
  Layers,
  Eye,
  CheckCircle2,
  Columns2,
  ZoomIn,
  Palette,
  Camera,
  Award
} from 'lucide-react';
import {
  RestorationSettings,
  RestorationMode,
  defaultSettings,
  applyRestoration,
} from '../utils/photoRestoration.ts';
import { samplePortraits, SamplePortrait } from '../data/samples.ts';

interface RestorationStudioProps {
  onRestoredShare?: (item: any) => void;
  uploadedImage?: string | null;
  onClearUploadedImage?: () => void;
}

export const RestorationStudio: React.FC<RestorationStudioProps> = ({
  onRestoredShare: _onRestoredShare,
  uploadedImage,
  onClearUploadedImage,
}) => {
  // Current active sample portrait
  const [selectedSample, setSelectedSample] = useState<SamplePortrait | null>(samplePortraits[0]);
  const [originalImageSrc, setOriginalImageSrc] = useState<string>(samplePortraits[0].damagedSrc);
  const [restoredImageSrc, setRestoredImageSrc] = useState<string>(samplePortraits[0].restoredNaturalSrc);

  // Active Restoration Mode (bw, natural, historical)
  const [currentMode, setCurrentMode] = useState<RestorationMode>('natural');

  // Slider position (0 - 100%)
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // Magnifier Zoom feature
  const [showMagnifier, setShowMagnifier] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Settings & Processing
  const [settings, setSettings] = useState<RestorationSettings>({
    ...defaultSettings,
    mode: 'natural',
    martyrName: samplePortraits[0].name,
    birthDeathYears: samplePortraits[0].year,
    hometown: samplePortraits[0].hometown,
  });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeTabControl, setActiveTabControl] = useState<'modes' | 'presets' | 'adjust' | 'frame'>('modes');
  const [viewMode, setViewMode] = useState<'split' | 'side' | 'restored'>('split');

  // Gemini AI Analysis
  const [isAnalyzingGemini, setIsAnalyzingGemini] = useState<boolean>(false);
  const [geminiResult, setGeminiResult] = useState<any>(null);
  const [showGeminiModal, setShowGeminiModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to get image based on mode
  const getRestoredImageForMode = (sample: SamplePortrait, mode: RestorationMode) => {
    if (mode === 'bw') return sample.restoredBwSrc;
    if (mode === 'historical') return sample.restoredHistoricalSrc;
    return sample.restoredNaturalSrc;
  };

  // Switch Restoration Mode (Đen Trắng, Màu Tự Nhiên, Màu Quân Phục Lịch Sử)
  const handleSelectMode = async (mode: RestorationMode) => {
    setCurrentMode(mode);
    const updatedSettings = { ...settings, mode };
    setSettings(updatedSettings);

    if (selectedSample && settings.frameStyle === 'none') {
      const targetSrc = getRestoredImageForMode(selectedSample, mode);
      setRestoredImageSrc(targetSrc);
    } else {
      await runRestoration(updatedSettings, originalImageSrc);
    }
  };

  // Apply restoration updates
  const runRestoration = async (newSettings = settings, imgSrc = originalImageSrc) => {
    setIsProcessing(true);
    try {
      if (
        selectedSample &&
        selectedSample.isRealEvidence &&
        imgSrc === selectedSample.damagedSrc &&
        newSettings.frameStyle === 'none'
      ) {
        setRestoredImageSrc(getRestoredImageForMode(selectedSample, newSettings.mode));
      } else {
        const baseSrc = selectedSample?.isRealEvidence
          ? getRestoredImageForMode(selectedSample, newSettings.mode)
          : imgSrc;
        const resultDataUrl = await applyRestoration(baseSrc, newSettings);
        setRestoredImageSrc(resultDataUrl);
      }
    } catch (err) {
      console.error('Restoration failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Automatically load external uploaded image when provided
  useEffect(() => {
    if (uploadedImage) {
      setSelectedSample(null);
      setOriginalImageSrc(uploadedImage);
      const initialSettings: RestorationSettings = {
        ...defaultSettings,
        mode: currentMode,
        martyrName: '',
        birthDeathYears: '',
        hometown: '',
      };
      setSettings(initialSettings);
      runRestoration(initialSettings, uploadedImage);
    }
  }, [uploadedImage]);

  // Sample Selection
  const handleSelectSample = (sample: SamplePortrait) => {
    if (onClearUploadedImage) {
      onClearUploadedImage();
    }
    setSelectedSample(sample);
    setOriginalImageSrc(sample.damagedSrc);
    setRestoredImageSrc(getRestoredImageForMode(sample, currentMode));
    setSettings((prev) => ({
      ...prev,
      martyrName: sample.name,
      birthDeathYears: sample.year,
      hometown: sample.hometown,
    }));
  };

  // User Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        setSelectedSample(null);
        setOriginalImageSrc(dataUrl);

        const initialSettings: RestorationSettings = {
          ...defaultSettings,
          mode: currentMode,
          martyrName: '',
          birthDeathYears: '',
          hometown: '',
        };
        setSettings(initialSettings);
        await runRestoration(initialSettings, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Slider Mouse/Touch handler
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(clamped);
  };

  const handleMouseDown = () => setIsDraggingSlider(true);

  // Zoom Loupe Coordinates
  const handleMouseMoveContainer = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingSlider) {
      handleSliderMove(e.clientX);
    }
    if (showMagnifier && sliderContainerRef.current) {
      const rect = sliderContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setZoomPos({ x, y });
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) handleSliderMove(e.clientX);
    };
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider && e.touches[0]) handleSliderMove(e.touches[0].clientX);
    };
    const handleGlobalStop = () => setIsDraggingSlider(false);

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalStop);
    window.addEventListener('touchmove', handleGlobalTouchMove);
    window.addEventListener('touchend', handleGlobalStop);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalStop);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalStop);
    };
  }, [isDraggingSlider]);

  // Gemini AI Analysis
  const handleAnalyzeWithGemini = async () => {
    setIsAnalyzingGemini(true);
    setShowGeminiModal(true);
    try {
      const res = await fetch('/api/ai/analyze-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eraHint: selectedSample?.era || 'Chiến trường chống Mỹ',
          soldierRoleHint: selectedSample?.rank || 'Chiến sĩ Quân đội Nhân dân Việt Nam',
          imageBase64: originalImageSrc.startsWith('data:') ? originalImageSrc : undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.analysis) {
        setGeminiResult(data.analysis);
      }
    } catch (err) {
      console.error('Gemini analysis failed:', err);
    } finally {
      setIsAnalyzingGemini(false);
    }
  };

  // Download High-Res
  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `phuc-dung-${currentMode}-${settings.martyrName || 'nhung-guong-mat-bat-tu'}.png`;
    link.href = restoredImageSrc;
    link.click();

    setExportNotice('Đã xuất ảnh phục dựng độ phân giải cao thành công!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <section id="studio-section" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>XƯỞNG PHỤC DỰNG DI ẢNH VỚI 3 PHONG CÁCH TÙY CHỌN</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
          Lựa Chọn 3 Cách Phục Dựng Di Ảnh
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Linh hoạt lựa chọn: <span className="text-amber-300 font-semibold">Màu Tự Nhiên</span> (da mặt hồng hào tự nhiên), <span className="text-slate-200 font-semibold">Đen Trắng Cổ Điển</span> (khử ố xước trang nghiêm), hoặc <span className="text-emerald-400 font-semibold">Màu Quân Phục Lịch Sử</span>.
        </p>
      </div>

      {/* 3 Restoration Mode Selector Cards (Prominent at top) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 max-w-4xl mx-auto">
        {/* Mode 1: Natural Color */}
        <button
          onClick={() => handleSelectMode('natural')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-3.5 ${
            currentMode === 'natural'
              ? 'border-amber-400 bg-gradient-to-r from-amber-950/60 to-purple-950/60 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400'
              : 'border-purple-800/40 bg-purple-950/20 hover:bg-purple-900/30'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Palette className="w-5 h-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                Màu Tự Nhiên
              </span>
              {currentMode === 'natural' && (
                <span className="text-[10px] font-bold text-amber-950 bg-amber-400 px-2 py-0.5 rounded-full">
                  Đang chọn
                </span>
              )}
            </div>
            <p className="text-[11px] text-amber-200/90 mt-0.5 leading-snug">
              Da mặt hồng hào ấm áp, ánh mắt sống động như ảnh tư liệu
            </p>
          </div>
        </button>

        {/* Mode 2: Black & White */}
        <button
          onClick={() => handleSelectMode('bw')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-3.5 ${
            currentMode === 'bw'
              ? 'border-slate-300 bg-gradient-to-r from-slate-900 to-purple-950/60 shadow-xl shadow-white/10 ring-1 ring-slate-300'
              : 'border-purple-800/40 bg-purple-950/20 hover:bg-purple-900/30'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-slate-700/40 border border-slate-400/40 flex items-center justify-center shrink-0">
            <Camera className="w-5 h-5 text-slate-200" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                Đen Trắng Cổ Điển
              </span>
              {currentMode === 'bw' && (
                <span className="text-[10px] font-bold text-slate-950 bg-slate-200 px-2 py-0.5 rounded-full">
                  Đang chọn
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Khử sạch ố vàng rách nát, giữ nét trang nghiêm chuẩn thờ cúng
            </p>
          </div>
        </button>

        {/* Mode 3: Historical Uniform */}
        <button
          onClick={() => handleSelectMode('historical')}
          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex items-center gap-3.5 ${
            currentMode === 'historical'
              ? 'border-emerald-400 bg-gradient-to-r from-emerald-950/60 to-purple-950/60 shadow-xl shadow-emerald-500/20 ring-1 ring-emerald-400'
              : 'border-purple-800/40 bg-purple-950/20 hover:bg-purple-900/30'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs text-white uppercase tracking-wider">
                Quân Phục Lịch Sử
              </span>
              {currentMode === 'historical' && (
                <span className="text-[10px] font-bold text-emerald-950 bg-emerald-400 px-2 py-0.5 rounded-full">
                  Đang chọn
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-200/90 mt-0.5 leading-snug">
              Sắc áo cỏ úa bộ đội, ve áo đỏ sao vàng chuẩn bảo tàng
            </p>
          </div>
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Canvas Viewer (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top Controls Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
            {/* View Mode Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-black/50 rounded-lg">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'split' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Kéo Thanh Trượt Trước / Sau</span>
              </button>
              <button
                onClick={() => setViewMode('side')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'side' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Xem Song Song</span>
              </button>
              <button
                onClick={() => setViewMode('restored')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'restored' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Toàn Bộ Ảnh Đã Phục Chế</span>
              </button>
            </div>

            {/* Magnifier & Gemini buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMagnifier(!showMagnifier)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  showMagnifier
                    ? 'bg-amber-400 text-slate-950 border-amber-400'
                    : 'bg-black/40 text-slate-300 border-white/10 hover:text-white'
                }`}
                title="Bật/Tắt kính lúp soi chi tiết nét tóc & da mặt"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>{showMagnifier ? 'Đang soi kính lúp' : 'Soi chi tiết (Kính lúp)'}</span>
              </button>

              <button
                onClick={handleAnalyzeWithGemini}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-indigo-300" />
                <span>Phân tích Gemini AI</span>
              </button>
            </div>
          </div>

          {/* Canvas Display Viewport */}
          <div className="relative rounded-2xl overflow-hidden border border-purple-800/50 bg-[#0d0218] shadow-2xl flex items-center justify-center min-h-[500px] p-2">
            {/* View Mode 1: Split Slider */}
            {viewMode === 'split' && (
              <div
                ref={sliderContainerRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                onMouseMove={handleMouseMoveContainer}
                className="relative w-full max-w-[500px] aspect-[684/846] select-none cursor-ew-resize overflow-hidden mx-auto my-3 rounded-lg shadow-2xl border border-white/10"
              >
                {/* Restored Photo */}
                <img
                  src={restoredImageSrc}
                  alt={`Ảnh phục dựng - ${currentMode}`}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                {/* Damaged Photo */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={originalImageSrc}
                    alt="Ảnh gốc - ố vàng xước rách"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: sliderContainerRef.current?.clientWidth || 500 }}
                    referrerPolicy="no-referrer"
                  />
                  {/* Left Label */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded bg-black/80 text-xs font-bold text-amber-300 uppercase tracking-wider backdrop-blur-xs border border-white/10">
                    ẢNH GỐC
                  </span>
                </div>

                {/* Right Label */}
                <span className="absolute top-4 right-4 px-3 py-1 rounded bg-amber-400 text-xs font-black text-slate-950 uppercase tracking-wider backdrop-blur-xs shadow-md pointer-events-none">
                  {currentMode === 'bw'
                    ? 'ẢNH PHỤC DỰNG (ĐEN TRẮNG)'
                    : currentMode === 'natural'
                    ? 'ẢNH PHỤC DỰNG (MÀU TỰ NHIÊN)'
                    : 'ẢNH PHỤC DỰNG (QUÂN PHỤC LỊCH SỬ)'}
                </span>

                {/* Vertical Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.9)] pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-xl border-2 border-slate-950">
                    ⇄
                  </div>
                </div>

                {/* Zoom Magnifier */}
                {showMagnifier && (
                  <div
                    className="absolute w-36 h-36 rounded-full border-2 border-amber-400 shadow-2xl pointer-events-none overflow-hidden bg-black"
                    style={{
                      left: `${zoomPos.x - 72}px`,
                      top: `${zoomPos.y - 72}px`,
                      backgroundImage: `url(${restoredImageSrc})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: `${(sliderContainerRef.current?.clientWidth || 500) * 2.5}px ${(sliderContainerRef.current?.clientHeight || 620) * 2.5}px`,
                      backgroundPosition: `-${zoomPos.x * 2.5 - 72}px -${zoomPos.y * 2.5 - 72}px`,
                    }}
                  />
                )}
              </div>
            )}

            {/* View Mode 2: Side-by-Side */}
            {viewMode === 'side' && (
              <div className="w-full max-w-4xl p-2 sm:p-4">
                <div className="text-center font-serif text-lg sm:text-xl font-bold tracking-wider text-white uppercase mb-4">
                  MINH CHỨNG PHỤC DỰNG ẢNH LIỆT SĨ
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-6">
                  {/* Left: Original */}
                  <div className="flex flex-col items-center">
                    <div className="aspect-[684/846] rounded-lg overflow-hidden border-2 border-white/20 bg-black/60 shadow-xl w-full">
                      <img
                        src={originalImageSrc}
                        alt="Ảnh gốc bị rách ố mờ"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="mt-3 font-serif font-bold text-sm sm:text-base text-white uppercase tracking-wider">
                      ẢNH GỐC
                    </span>
                  </div>

                  {/* Right: Restored */}
                  <div className="flex flex-col items-center">
                    <div className="aspect-[684/846] rounded-lg overflow-hidden border-2 border-amber-400 bg-black/60 shadow-2xl shadow-amber-500/20 w-full">
                      <img
                        src={restoredImageSrc}
                        alt="Ảnh phục dựng sắc nét"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="mt-3 font-serif font-bold text-sm sm:text-base text-amber-300 uppercase tracking-wider">
                      ẢNH PHỤC DỰNG ({currentMode === 'bw' ? 'ĐEN TRẮNG' : currentMode === 'natural' ? 'MÀU TỰ NHIÊN' : 'QUÂN PHỤC'})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* View Mode 3: Restored Full Frame */}
            {viewMode === 'restored' && (
              <div className="p-4 w-full max-w-[500px]">
                <div className="aspect-[684/846] rounded-lg overflow-hidden border-2 border-amber-400 shadow-2xl shadow-amber-500/30">
                  <img
                    src={restoredImageSrc}
                    alt="Ảnh phục dựng hoàn chỉnh"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Row Under Canvas */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-white text-xs font-semibold border border-purple-700/50 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-amber-400" />
                <span>Tải ảnh di ảnh cần phục dựng</span>
              </button>

              <button
                onClick={() => {
                  setSettings(defaultSettings);
                  setCurrentMode('natural');
                  runRestoration(defaultSettings);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-xs font-medium border border-slate-700/40 transition-colors cursor-pointer"
                title="Khôi phục mặc định"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đặt lại</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/25 cursor-pointer"
              >
                <Download className="w-4 h-4 fill-slate-950" />
                <span>Tải ảnh sắc nét (In ấn 300 DPI)</span>
              </button>
            </div>
          </div>

          {exportNotice && (
            <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{exportNotice}</span>
            </div>
          )}
        </div>

        {/* Right Column: Controls, Presets & Frames (4 Cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Tabs */}
          <div className="flex rounded-xl bg-purple-950/60 p-1 border border-purple-800/50">
            <button
              onClick={() => setActiveTabControl('modes')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase ${
                activeTabControl === 'modes' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              3 Phong Cách
            </button>
            <button
              onClick={() => setActiveTabControl('presets')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase ${
                activeTabControl === 'presets' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Tư Liệu Mẫu
            </button>
            <button
              onClick={() => setActiveTabControl('adjust')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase ${
                activeTabControl === 'adjust' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Công Cụ AI
            </button>
            <button
              onClick={() => setActiveTabControl('frame')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase ${
                activeTabControl === 'frame' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              Khung Tri Ân
            </button>
          </div>

          {/* TAB 0: 3 RESTORATION MODES DETAIL */}
          {activeTabControl === 'modes' && (
            <div className="space-y-3.5 p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-4 h-4" />
                <span>So sánh 3 cách phục chế trực tiếp</span>
              </h3>

              <div className="space-y-3">
                {/* Mode 1: Natural Color Detail */}
                <button
                  onClick={() => handleSelectMode('natural')}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    currentMode === 'natural'
                      ? 'border-amber-400 bg-amber-400/15 shadow-md ring-1 ring-amber-400'
                      : 'border-purple-800/40 bg-purple-900/20 hover:bg-purple-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-amber-300">1. Màu Tự Nhiên (Khuyên dùng)</span>
                    <span className="text-[10px] text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-600/40">
                      Tự nhiên
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Tái tạo làn da Á Đông hồng hào, mềm mịn, giữ trọn ánh mắt trong sáng và sắc diện ấm áp như ảnh chụp chân dung đời thường.
                  </p>
                </button>

                {/* Mode 2: Black & White Detail */}
                <button
                  onClick={() => handleSelectMode('bw')}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    currentMode === 'bw'
                      ? 'border-slate-300 bg-slate-800/40 shadow-md ring-1 ring-slate-300'
                      : 'border-purple-800/40 bg-purple-900/20 hover:bg-purple-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-100">2. Đen Trắng Sắc Nét</span>
                    <span className="text-[10px] text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      Trang nghiêm
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Khử triệt để vết xước, rách, nếp gấp và vệt ố vàng hóa chất; giữ nguyên chất ảnh phim đen trắng cổ điển, sâu thẳm, trang nghiêm trên bàn thờ gia tiên.
                  </p>
                </button>

                {/* Mode 3: Historical Uniform Detail */}
                <button
                  onClick={() => handleSelectMode('historical')}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    currentMode === 'historical'
                      ? 'border-emerald-400 bg-emerald-950/40 shadow-md ring-1 ring-emerald-400'
                      : 'border-purple-800/40 bg-purple-900/20 hover:bg-purple-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-emerald-300">3. Màu Quân Phục Lịch Sử</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/40">
                      Chuẩn bảo tàng
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Tái hiện chuẩn sắc áo xanh cỏ úa truyền thống của Quân đội Nhân dân Việt Nam, ve áo cờ đỏ sao vàng và phông nền studio thời chiến.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: PRESET SELECTION */}
          {activeTabControl === 'presets' && (
            <div className="space-y-3.5 p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Di ảnh các Anh hùng Liệt sĩ tiêu biểu</span>
              </h3>

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {samplePortraits.map((sample) => {
                  const isSelected = selectedSample?.id === sample.id;
                  const thumbSrc = getRestoredImageForMode(sample, currentMode);
                  return (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400/10 shadow-lg'
                          : 'border-purple-800/40 bg-purple-900/20 hover:bg-purple-900/40'
                      }`}
                    >
                      <div className="w-12 h-14 rounded-md overflow-hidden bg-black shrink-0 border border-white/20">
                        <img src={thumbSrc} alt={sample.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-white truncate">{sample.name}</p>
                          {sample.isRealEvidence && (
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-500/50 shrink-0">
                              TƯ LIỆU THỰC
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-amber-300/80 truncate mt-0.5">{sample.rank}</p>
                        <p className="text-[10px] text-slate-400 truncate">{sample.year}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedSample && (
                <div className="mt-2 p-3 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">{selectedSample.name}</span>
                    <span className="text-[10px] text-slate-400">{selectedSample.era}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{selectedSample.story}</p>
                  {selectedSample.certificateSrc && (
                    <button
                      onClick={() => setShowCertificateModal(true)}
                      className="w-full mt-1.5 py-2 px-3 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>📜</span>
                      <span>Xem Bằng Tổ Quốc Ghi Công (Hồ sơ gốc)</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AI ADJUSTMENTS */}
          {activeTabControl === 'adjust' && (
            <div className="space-y-4 p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  <span>Tinh chỉnh thông số AI</span>
                </h3>
                <button
                  onClick={() => {
                    const autoSettings: RestorationSettings = {
                      ...defaultSettings,
                      mode: currentMode,
                      scratchRemoval: 90,
                      faceSharpening: 85,
                      deYellowing: 95,
                      contrastBoost: 35,
                      brightness: 5,
                      skinWarmth: 50,
                    };
                    setSettings(autoSettings);
                    runRestoration(autoSettings);
                  }}
                  className="text-[11px] text-amber-300 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tự động tối ưu nét</span>
                </button>
              </div>

              {/* Slider: Scratch removal */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Khử vết xước, rách & nếp gấp:</span>
                  <span className="font-mono text-amber-300 tabular-nums">{settings.scratchRemoval}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.scratchRemoval}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const upd = { ...settings, scratchRemoval: val };
                    setSettings(upd);
                    runRestoration(upd);
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider: Face Sharpening */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Siêu phân giải nét mặt & mắt:</span>
                  <span className="font-mono text-amber-300 tabular-nums">{settings.faceSharpening}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.faceSharpening}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const upd = { ...settings, faceSharpening: val };
                    setSettings(upd);
                    runRestoration(upd);
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider: De-yellowing */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Khử ố vàng & phục hồi nền:</span>
                  <span className="font-mono text-amber-300 tabular-nums">{settings.deYellowing}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.deYellowing}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const upd = { ...settings, deYellowing: val };
                    setSettings(upd);
                    runRestoration(upd);
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider: Skin Warmth */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Sắc da Á Đông tự nhiên:</span>
                  <span className="font-mono text-amber-300 tabular-nums">{settings.skinWarmth}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={settings.skinWarmth}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const upd = { ...settings, skinWarmth: val };
                    setSettings(upd);
                    runRestoration(upd);
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Slider: Contrast */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Độ tương phản & chiều sâu:</span>
                  <span className="font-mono text-amber-300 tabular-nums">{settings.contrastBoost}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={settings.contrastBoost}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const upd = { ...settings, contrastBoost: val };
                    setSettings(upd);
                    runRestoration(upd);
                  }}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: COMMEMORATIVE FRAMING */}
          {activeTabControl === 'frame' && (
            <div className="space-y-4 p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40">
              <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Khung Di Ảnh Tri Ân & Ghi Danh</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    const upd = { ...settings, frameStyle: 'none' as const };
                    setSettings(upd);
                    runRestoration(upd);
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                    settings.frameStyle === 'none'
                      ? 'border-amber-400 bg-amber-400/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300'
                  }`}
                >
                  Ảnh thuần (Không khung)
                </button>

                <button
                  onClick={() => {
                    const upd = { ...settings, frameStyle: 'to_quoc_ghi_cong' as const };
                    setSettings(upd);
                    runRestoration(upd);
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                    settings.frameStyle === 'to_quoc_ghi_cong'
                      ? 'border-amber-400 bg-amber-400/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300'
                  }`}
                >
                  Tổ Quốc Ghi Công
                </button>

                <button
                  onClick={() => {
                    const upd = { ...settings, frameStyle: 'doi_doi_nho_on' as const };
                    setSettings(upd);
                    runRestoration(upd);
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                    settings.frameStyle === 'doi_doi_nho_on'
                      ? 'border-amber-400 bg-amber-400/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300'
                  }`}
                >
                  Đời Đời Nhớ Ơn
                </button>

                <button
                  onClick={() => {
                    const upd = { ...settings, frameStyle: 'classic_gold' as const };
                    setSettings(upd);
                    runRestoration(upd);
                  }}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition-colors ${
                    settings.frameStyle === 'classic_gold'
                      ? 'border-amber-400 bg-amber-400/20 text-white font-bold'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300'
                  }`}
                >
                  Khung Gỗ Mun Cổ Điển
                </button>
              </div>

              {settings.frameStyle !== 'none' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Họ tên Liệt sĩ / Tiền bối:
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Nguyễn Văn Minh"
                      value={settings.martyrName || ''}
                      onChange={(e) => {
                        const upd = { ...settings, martyrName: e.target.value };
                        setSettings(upd);
                      }}
                      onBlur={() => runRestoration(settings)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Năm sinh – Năm hy sinh:
                    </label>
                    <input
                      type="text"
                      placeholder="VD: 1949 – 1972"
                      value={settings.birthDeathYears || ''}
                      onChange={(e) => {
                        const upd = { ...settings, birthDeathYears: e.target.value };
                        setSettings(upd);
                      }}
                      onBlur={() => runRestoration(settings)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                      Quê quán / Đơn vị:
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Triệu Phong, Quảng Trị"
                      value={settings.hometown || ''}
                      onChange={(e) => {
                        const upd = { ...settings, hometown: e.target.value };
                        setSettings(upd);
                      }}
                      onBlur={() => runRestoration(settings)}
                      className="w-full px-3 py-2 text-xs rounded-lg bg-black/60 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    onClick={() => runRestoration(settings)}
                    className="w-full py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cập nhật vào Khung Di Ảnh
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Gemini AI Modal */}
      {showGeminiModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17052c] border border-purple-700/60 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowGeminiModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 mb-4 text-amber-300 font-bold text-base">
              <Bot className="w-5 h-5 text-indigo-400" />
              <span>Phân Tích Bối Cảnh Lịch Sử (Gemini AI)</span>
            </div>

            {isAnalyzingGemini ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-300">
                  Mô hình Gemini 3.8 Flash đang giám định đặc trưng quân phục và bối cảnh lịch sử...
                </p>
              </div>
            ) : geminiResult ? (
              <div className="space-y-4 text-xs">
                <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-700/40">
                  <span className="font-bold text-amber-300 block mb-1">Thời kỳ Lịch sử Xác định:</span>
                  <p className="text-slate-200">{geminiResult.historicalEra}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-purple-900/30 border border-purple-700/40">
                  <span className="font-bold text-amber-300 block mb-1">Quân phục chuẩn lịch sử:</span>
                  <p className="text-slate-200">{geminiResult.uniformType}</p>
                </div>

                {geminiResult.tributeVerse && (
                  <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200">
                    <span className="font-bold block mb-1 text-xs text-amber-300">Khắc Ghi Công Ơn Người Anh Hùng:</span>
                    <blockquote className="italic font-serif leading-relaxed whitespace-pre-line text-xs">
                      {geminiResult.tributeVerse}
                    </blockquote>
                  </div>
                )}

                <button
                  onClick={() => setShowGeminiModal(false)}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Certificate Modal (Bằng Tổ Quốc Ghi Công) */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#17052c] border border-amber-500/50 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-3 text-amber-300 font-bold text-base">
              <span>📜</span>
              <span>Hồ Sơ Tư Liệu Gốc: Bằng Tổ Quốc Ghi Công</span>
            </div>

            <div className="rounded-xl overflow-hidden border border-amber-500/40 shadow-xl mb-4 bg-black/40">
              <img
                src="/public/assets/aistudio/ls_s_M_-TH_M_c5ba7ac1.jpg"
                alt="Bằng Tổ Quốc Ghi Công Liệt sĩ Trần Ngọc Sâm"
                className="w-full max-h-[460px] object-contain mx-auto"
              />
            </div>

            <div className="p-4 rounded-xl bg-purple-900/30 border border-purple-700/40 text-xs space-y-1.5 text-slate-200">
              <p className="font-bold text-amber-300 text-sm">Liệt sĩ: Trần Ngọc Sâm</p>
              <p><span className="text-slate-400">Chức vụ:</span> Chính trị viên đại đội Quân đội nhân dân Việt Nam</p>
              <p><span className="text-slate-400">Nguyên quán:</span> Xã Vĩnh Liêm, khu vực Vĩnh Linh, Quảng Trị</p>
              <p><span className="text-slate-400">Ngày hy sinh:</span> 16 tháng 3 năm 1972 (Kháng chiến chống Mỹ cứu nước)</p>
              <p className="text-[11px] text-slate-400 pt-1.5 border-t border-white/10">
                Quyết định số 393 TTg ngày 30/7/1974, Bằng số NR 114b do Thủ tướng Chính phủ Phạm Văn Đồng ký.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
