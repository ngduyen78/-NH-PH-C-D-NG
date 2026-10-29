import React, { useState } from 'react';
import { X, Flame, Sparkles, Heart } from 'lucide-react';

interface CandleTributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CandleTributeModal: React.FC<CandleTributeModalProps> = ({ isOpen, onClose }) => {
  const [candleCount, setCandleCount] = useState<number>(142850);
  const [hasLit, setHasLit] = useState<boolean>(false);
  const [tributeMessage, setTributeMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<{ name: string; text: string; time: string }>>([
    { name: 'Nguyễn Thu Trang (Hà Nội)', text: 'Đời đời nhớ ơn các anh, những người con bất tử của Đất Mẹ.', time: 'Vừa xong' },
    { name: 'Trần Văn Nam (TP. Hồ Chí Minh)', text: 'Xin cúi đầu trước anh linh các anh hùng liệt sĩ.', time: '5 phút trước' },
    { name: 'Cựu chiến binh Lê Dũng (Quảng Trị)', text: 'Thắp nén nhang cho đồng đội Trung đoàn 9 Thành Cổ.', time: '12 phút trước' },
  ]);

  if (!isOpen) return null;

  const handleLightCandle = () => {
    if (!hasLit) {
      setCandleCount((prev) => prev + 1);
      setHasLit(true);

      // Play soft harmonic audio chime using Web Audio API synthesis
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, audioCtx.currentTime); // Solfeggio 528 Hz healing chime
        osc.frequency.exponentialRampToValueAtTime(792, audioCtx.currentTime + 1.2);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);
      } catch (e) {
        // AudioContext silent fallback
      }
    }
  };

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (tributeMessage.trim()) {
      setMessages((prev) => [
        {
          name: 'Đồng bào kính viếng',
          text: tributeMessage.trim(),
          time: 'Vừa xong',
        },
        ...prev,
      ]);
      setTributeMessage('');
      if (!hasLit) handleLightCandle();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#17052c] border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-lg font-bold cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NGHI THỨC TRI ÂN TRUYỀN THỐNG</span>
          </div>

          <h3 className="text-xl font-extrabold text-white uppercase tracking-wider">
            Thắp Nến & Dâng Nén Nhang Tri Ân
          </h3>

          {/* Candle Flame Visualization */}
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="relative">
              {/* Flame Glow */}
              <div
                className={`w-16 h-24 rounded-full bg-gradient-to-t from-amber-500 via-orange-400 to-yellow-200 blur-sm transition-all duration-700 ${
                  hasLit ? 'scale-125 opacity-100 animate-pulse' : 'scale-90 opacity-70'
                }`}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-10 rounded-full bg-white blur-[2px] opacity-90" />
            </div>

            {/* Candle base */}
            <div className="w-12 h-20 bg-gradient-to-r from-red-800 via-red-600 to-red-900 rounded-b-md shadow-lg -mt-3 border-t border-amber-400" />
            <div className="w-24 h-3 bg-amber-900/60 rounded-full mt-1 border border-amber-500/30" />
          </div>

          {/* Counter */}
          <div className="p-3 rounded-xl bg-purple-950/50 border border-purple-800/40 inline-block">
            <span className="text-xs text-slate-300 block">Số ngọn nến & nén nhang đã thắp:</span>
            <span className="text-2xl font-black text-amber-300 font-mono tabular-nums">
              {candleCount.toLocaleString('vi-VN')}
            </span>
          </div>

          {/* Light Candle Button */}
          <div>
            <button
              onClick={handleLightCandle}
              className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 mx-auto shadow-xl ${
                hasLit
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 shadow-amber-500/30'
              }`}
            >
              <Flame className="w-4 h-4 fill-current" />
              <span>{hasLit ? 'Đã dâng ngọn nến tri ân' : 'Chạm để thắp nến tri ân'}</span>
            </button>
          </div>

          {/* Guestbook Form */}
          <form onSubmit={handleAddMessage} className="pt-2 flex gap-2">
            <input
              type="text"
              placeholder="Gửi lời tri ân, tưởng nhớ đến các anh..."
              value={tributeMessage}
              onChange={(e) => setTributeMessage(e.target.value)}
              className="flex-1 px-3 py-2 text-xs rounded-xl bg-black/60 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-800 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Gửi
            </button>
          </form>

          {/* Recent Tributes */}
          <div className="space-y-2 text-left pt-2 max-h-36 overflow-y-auto">
            {messages.map((m, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                <div className="flex justify-between text-slate-400 text-[10px] mb-0.5">
                  <span className="font-semibold text-amber-300">{m.name}</span>
                  <span>{m.time}</span>
                </div>
                <p className="text-slate-200 italic">"{m.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
