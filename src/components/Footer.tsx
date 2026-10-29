import React from 'react';
import { Star, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: any) => void;
  onOpenSupportModal: () => void;
  onOpenCandleModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenSupportModal,
  onOpenCandleModal,
}) => {
  return (
    <footer className="bg-[#0e021a] border-t border-purple-900/50 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
                <Star className="w-4 h-4 fill-slate-950 text-slate-950" />
              </div>
              <span className="text-base font-extrabold tracking-wider text-white uppercase">
                NHỮNG GƯƠNG MẶT BẤT TỬ
              </span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              Dự án thiện nguyện số hóa và phục chế di ảnh màu cho các Anh hùng Liệt sĩ, thương bệnh binh, Mẹ Việt Nam Anh Hùng và các thế hệ cha anh đã cống hiến cho Tổ quốc.
            </p>
            <p className="text-[11px] text-amber-300/80 italic">
              "Thắp sáng ký ức – Sáng mãi tên anh – Non sông ngàn năm ghi nhớ công ơn."
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Điều hướng chính
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Trang chủ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('restore')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-amber-300"
                >
                  Xưởng phục dựng di ảnh AI
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('library')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Thư viện ký ức & Trước/Sau
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('map')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Bản đồ 63 tỉnh thành & Nghĩa trang
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('search')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  Tra cứu hồ sơ liệt sĩ
                </button>
              </li>
            </ul>
          </div>

          {/* Non-Profit & Volunteer Pledge */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Hỗ trợ thân nhân
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenSupportModal}
                  className="text-cyan-400 hover:underline cursor-pointer font-semibold"
                >
                  Gửi ảnh phục dựng miễn phí
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCandleModal}
                  className="text-amber-300 hover:underline cursor-pointer"
                >
                  Thắp nến & dâng nhang trực tuyến
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Phi thương mại & Bảo mật thông tin</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Những Gương Mặt Bất Tử. Hành trình số – Quảng Trị My Love.</p>
          <div className="flex items-center gap-1">
            <span>Tri ân với tất cả lòng thành kính</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
