import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Sparkles, Building2, Flame } from 'lucide-react';

interface MemorialSite {
  id: string;
  name: string;
  province: string;
  lat: number;
  lng: number;
  count: string;
  restoredCount: number;
}

export const MemorialMap: React.FC = () => {
  const [locations, setLocations] = useState<MemorialSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<MemorialSite | null>(null);

  useEffect(() => {
    fetch('/api/memorial-locations')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLocations(data.data);
          setSelectedSite(data.data[0]);
        }
      })
      .catch((err) => console.error('Failed to load locations', err));
  }, []);

  return (
    <section id="map-section" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold mb-3">
          <Navigation className="w-3.5 h-3.5" />
          <span>MẠNG LƯỚI TRI ÂN 63 TỈNH THÀNH</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
          Bản Đồ Kết Nối & Nghĩa Trang Liệt Sĩ
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Kết nối thân nhân liệt sĩ với các đài tưởng niệm quốc gia, nghĩa trang liệt sĩ và các trạm phục chế di ảnh lưu động từ Bắc chí Nam.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left side: Interactive Memorial Landmarks List (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Địa chỉ Tưởng niệm Trọng điểm ({locations.length})</span>
          </h3>

          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {locations.map((site) => {
              const isSelected = selectedSite?.id === site.id;
              return (
                <button
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg'
                      : 'border-purple-800/40 bg-purple-950/20 hover:bg-purple-900/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-cyan-400 text-slate-950' : 'bg-purple-900/50 text-cyan-300'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{site.name}</h4>
                      <span className="text-[10px] font-semibold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/50 shrink-0">
                        {site.province}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">Quy mô: {site.count}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium mt-1">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Đã phục chế: {site.restoredCount.toLocaleString('vi-VN')} di ảnh</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side: Vietnam Map Visualization with Pinned Sites (7 Cols) */}
        <div className="lg:col-span-7 bg-purple-950/30 border border-purple-800/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          {/* Detailed Selected Site Banner */}
          {selectedSite && (
            <div className="mb-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                  Đang chọn địa điểm:
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">{selectedSite.name}</h4>
                <p className="text-xs text-slate-300 mt-0.5">Địa bàn: {selectedSite.province}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-xs text-slate-400 block">Số di ảnh số hóa:</span>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    +{selectedSite.restoredCount}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Vietnam Stylized Map Outline with Glowing Landmark Nodes */}
          <div className="relative aspect-[4/3] bg-[#0f021f] rounded-xl border border-purple-900/60 p-4 flex items-center justify-center overflow-hidden">
            {/* Map S-curve SVG decorative guide */}
            <svg viewBox="0 0 400 500" className="w-full h-full max-h-[420px] opacity-85">
              <defs>
                <linearGradient id="mapCurveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Vietnam S-Shape Schematic Spine */}
              <path
                d="M 180 50 Q 240 70 230 110 Q 210 140 240 180 Q 270 220 280 270 Q 285 330 250 380 Q 210 440 170 470 Q 140 450 160 410 Q 190 350 210 300 Q 220 230 190 190 Q 160 140 170 90 Z"
                fill="none"
                stroke="url(#mapCurveGrad)"
                strokeWidth="2.5"
                strokeDasharray="4 3"
              />

              {/* Islands Schematic */}
              <circle cx="340" cy="220" r="4" fill="#facc15" />
              <text x="350" y="224" fill="#cbd5e1" fontSize="9" fontFamily="sans-serif">Hoàng Sa</text>
              <circle cx="330" cy="360" r="4" fill="#facc15" />
              <text x="340" y="364" fill="#cbd5e1" fontSize="9" fontFamily="sans-serif">Trường Sa</text>

              {/* Landmark Nodes */}
              {locations.map((site, idx) => {
                // Approximate coordinate mapping to svg canvas
                const yMap = 50 + ((23 - site.lat) / (23 - 8.5)) * 400;
                const xMap = 160 + ((site.lng - 103) / (109 - 103)) * 130 + (idx % 2 === 0 ? 5 : -5);
                const isSelected = selectedSite?.id === site.id;

                return (
                  <g key={site.id} className="cursor-pointer" onClick={() => setSelectedSite(site)}>
                    {/* Pulsing ring for selected site */}
                    {isSelected && (
                      <circle cx={xMap} cy={yMap} r="14" fill="#38bdf8" opacity="0.25">
                        <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle
                      cx={xMap}
                      cy={yMap}
                      r={isSelected ? '6' : '4.5'}
                      fill={isSelected ? '#38bdf8' : '#f59e0b'}
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={xMap + 10}
                      y={yMap + 4}
                      fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                      fontSize={isSelected ? '10' : '9'}
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                    >
                      {site.province}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Legend */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Nghĩa trang Liệt sĩ & Đài tưởng niệm</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Hành trình số vì thân nhân Liệt sĩ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
