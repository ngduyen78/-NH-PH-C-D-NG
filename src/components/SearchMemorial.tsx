import React, { useState, useEffect } from 'react';
import { Search, Sparkles, BookOpen, MapPin, Calendar, Award } from 'lucide-react';

interface HeroRecord {
  id: string;
  name: string;
  birthYear: string;
  deathYear: string;
  hometown: string;
  role: string;
  burialSite: string;
  era: string;
  story: string;
}

export const SearchMemorial: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('all');
  const [records, setRecords] = useState<HeroRecord[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/memorial-heroes?q=${encodeURIComponent(searchTerm)}&era=${selectedEra}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeroes();
  }, [selectedEra]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHeroes();
  };

  return (
    <section id="search-section" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-3">
          <Search className="w-3.5 h-3.5" />
          <span>TRA CỨU HỒ SƠ & DI ẢNH LIỆT SĨ</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
          Tìm Kiếm Thông Tin Liệt Sĩ & Ký Ức
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mt-2">
          Hệ thống cơ sở dữ liệu số hóa kết nối thông tin danh tính, quê quán, đơn vị chiến đấu và nơi an nghỉ của các anh hùng liệt sĩ.
        </p>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-8 flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Nhập họ tên, quê quán (VD: Võ Thị Sáu, Quảng Trị, Cao Bằng)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-purple-950/70 border border-purple-800/60 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-amber-500/20"
          >
            Tìm kiếm
          </button>
        </form>

        {/* Filter tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'Kháng chiến chống Pháp', label: 'Thời kỳ chống Pháp' },
            { id: 'Kháng chiến chống Mỹ', label: 'Thời kỳ chống Mỹ' },
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedEra(tag.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                selectedEra === tag.id
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-purple-900/30 text-slate-300 hover:text-white'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((hero) => (
          <div
            key={hero.id}
            className="p-5 rounded-2xl bg-purple-950/30 border border-purple-800/40 hover:border-amber-400/50 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest px-2.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                  {hero.era}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">{hero.id}</span>
              </div>

              <h3 className="text-lg font-black text-white">{hero.name}</h3>
              <p className="text-xs text-amber-300/90 font-medium flex items-center gap-1.5 mt-1">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span>{hero.role}</span>
              </p>

              <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Năm sinh - mất: {hero.birthYear} – {hero.deathYear}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Quê quán: {hero.hometown}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Nơi an nghỉ: {hero.burialSite}</span>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-300/90 leading-relaxed italic bg-purple-900/20 p-3 rounded-xl border border-purple-800/30">
                "{hero.story}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
