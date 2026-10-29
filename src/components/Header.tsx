import React, { useState } from 'react';
import { Search, PenLine, HeartHandshake, Star, Menu, X, Flame } from 'lucide-react';

export type ActiveTab = 'home' | 'search' | 'restore' | 'support' | 'library' | 'map';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSupportModal: () => void;
  onOpenCandleModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSupportModal,
  onOpenCandleModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: Array<{
    id: ActiveTab;
    label: string;
    icon?: React.ReactNode;
    highlightClass?: string;
    onClick?: () => void;
  }> = [
    { id: 'home', label: 'TRANG CHỦ' },
    {
      id: 'search',
      label: 'TÌM KIẾM',
      icon: <Search className="w-3.5 h-3.5" />,
    },
    {
      id: 'restore',
      label: 'PHỤC DỰNG ẢNH',
      icon: <PenLine className="w-3.5 h-3.5" />,
      highlightClass: 'text-amber-400 font-bold hover:text-amber-300',
    },
    {
      id: 'support',
      label: 'LIÊN HỆ HỖ TRỢ',
      icon: <HeartHandshake className="w-3.5 h-3.5" />,
      highlightClass: 'text-cyan-400 font-semibold hover:text-cyan-300',
      onClick: () => onOpenSupportModal(),
    },
    { id: 'library', label: 'THƯ VIỆN KÝ ỨC' },
    { id: 'map', label: 'BẢN ĐỒ KẾT NỐI' },
  ];

  const handleTabClick = (item: typeof navItems[0]) => {
    if (item.onClick) {
      item.onClick();
    } else {
      onSelectTab(item.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#16052c]/95 backdrop-blur-md border-b border-purple-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <button
          onClick={() => {
            onSelectTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <Star className="w-5 h-5 fill-slate-950 text-slate-950" />
          </div>
          <span className="text-base sm:text-lg font-black tracking-wider text-white uppercase whitespace-nowrap">
            NHỮNG GƯƠNG MẶT BẤT TỬ
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-semibold tracking-wider">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item)}
                className={`flex items-center gap-1.5 py-1.5 transition-colors whitespace-nowrap cursor-pointer uppercase ${
                  item.highlightClass
                    ? item.highlightClass
                    : isActive
                    ? 'text-amber-400 border-b-2 border-amber-400'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action: Candle Tribute + Mobile Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCandleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer whitespace-nowrap"
            title="Thắp một nén nhang / ngọn nến tri ân"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span className="hidden sm:inline">Thắp nến tri ân</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#16042b] border-b border-purple-900/60 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold tracking-wider text-left transition-colors ${
                item.highlightClass ? item.highlightClass : 'text-slate-200 hover:bg-white/5'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
