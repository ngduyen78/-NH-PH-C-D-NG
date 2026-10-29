import React, { useState } from 'react';
import { samplePortraits, SamplePortrait, RestorationMode } from '../data/samples.ts';
import { Search, Sparkles, Filter, Calendar, MapPin, Eye, Palette } from 'lucide-react';

interface MemoryLibraryProps {
  onSelectToRestore: (portrait: SamplePortrait) => void;
}

export const MemoryLibrary: React.FC<MemoryLibraryProps> = ({ onSelectToRestore }) => {
  const [activeEra, setActiveEra] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sliderPositions, setSliderPositions] = useState<{ [key: string]: number }>({});
  const [libraryMode, setLibraryMode] = useState<RestorationMode>('natural');

  const eras = [
    { id: 'all', label: 'Tất cả thời kỳ' },
    { id: 'Kháng chiến chống Mỹ cứu nước', label: 'Chống Mỹ (1954 - 1975)' },
    { id: 'Kháng chiến chống Pháp', label: 'Chống Pháp (1945 - 1954)' },
  ];

  const filteredPortraits = samplePortraits.filter((item) => {
    const matchEra = activeEra === 'all' || item.era === activeEra;
    const matchQuery =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hometown.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rank.toLowerCase().includes(searchQuery.toLowerCase());
    return matchEra && matchQuery;
  });

  const handleCardSlider = (id: string, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPositions((prev) => ({ ...prev, [id]: percent }));
  };

  const getRestoredImage = (item: SamplePortrait) => {
    if (libraryMode === 'bw') return item.restoredBwSrc;
    if (libraryMode === 'historical') return item.restoredHistoricalSrc;
    return item.restoredNaturalSrc;
  };

  return (
    <section id="library-section" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-purple-900/40">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KHO TƯ LIỆU VĂN HÓA LỊCH SỬ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Thư Viện Ký Ức & Tri Ân
          </h2>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Lưu giữ hàng nghìn chân dung Anh hùng Liệt sĩ, thanh niên xung phong và tiền bối cách mạng với 3 cách phục chế: Màu tự nhiên, Đen trắng sắc nét và Màu quân phục.
          </p>
        </div>

        {/* Search input (matching Screenshot_1: "Tìm kiếm tên Liệt sĩ, người đăng, quê quán, tỉnh thành, trường...") */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm kiếm tên Liệt sĩ, quê quán, tỉnh thành..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl bg-purple-950/70 border border-purple-800/60 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner"
          />
        </div>
      </div>

      {/* Controls Bar: Era Filters & 3 Restoration Style Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Era filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
          {eras.map((era) => (
            <button
              key={era.id}
              onClick={() => setActiveEra(era.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeEra === era.id
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-purple-950/40 hover:bg-purple-900/50 text-slate-300 border border-purple-800/40'
              }`}
            >
              {era.label}
            </button>
          ))}
        </div>

        {/* 3 Restoration Mode Switcher in Library */}
        <div className="flex items-center gap-1 p-1 bg-black/50 rounded-xl border border-white/10">
          <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1 font-medium">
            <Palette className="w-3 h-3 text-amber-400" /> Xem kiểu:
          </span>
          <button
            onClick={() => setLibraryMode('natural')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              libraryMode === 'natural' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Màu Tự Nhiên
          </button>
          <button
            onClick={() => setLibraryMode('bw')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              libraryMode === 'bw' ? 'bg-slate-200 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Đen Trắng
          </button>
          <button
            onClick={() => setLibraryMode('historical')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              libraryMode === 'historical' ? 'bg-emerald-400 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Quân Phục
          </button>
        </div>
      </div>

      {/* Gallery Cards Grid with Live Hover/Touch Compare */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPortraits.map((portrait) => {
          const pos = sliderPositions[portrait.id] ?? 50;
          const restoredImg = getRestoredImage(portrait);

          return (
            <div
              key={portrait.id}
              className="group rounded-2xl overflow-hidden bg-purple-950/30 border border-purple-800/40 hover:border-amber-400/60 transition-all duration-300 flex flex-col shadow-xl"
            >
              {/* Interactive Card Image Box */}
              <div
                onMouseMove={(e) => handleCardSlider(portrait.id, e)}
                className="relative aspect-[3/4] bg-black overflow-hidden cursor-ew-resize select-none"
              >
                {/* Restored Layer */}
                <img
                  src={restoredImg}
                  alt={portrait.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Damaged Layer */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${pos}%` }}
                >
                  <img
                    src={portrait.damagedSrc}
                    alt="Ảnh trước phục dựng"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%' }}
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-slate-300">
                    Gốc
                  </span>
                </div>

                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-500/90 text-[10px] font-bold text-slate-950">
                  {libraryMode === 'bw' ? 'Đen Trắng' : libraryMode === 'natural' ? 'Tự Nhiên' : 'Quân Phục'}
                </span>

                {/* Slider divider */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] pointer-events-none"
                  style={{ left: `${pos}%` }}
                />
              </div>

              {/* Card Meta & Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                    {portrait.name}
                  </h3>
                  <p className="text-xs text-amber-300/90 font-medium mt-0.5 line-clamp-1">{portrait.rank}</p>

                  <div className="mt-2 space-y-1 text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{portrait.year}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{portrait.hometown}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectToRestore(portrait)}
                  className="w-full py-2 rounded-xl bg-purple-900/40 hover:bg-amber-400 hover:text-slate-950 text-slate-200 border border-purple-700/50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Mở chỉnh sửa trong Xưởng</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
