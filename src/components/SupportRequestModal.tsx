import React, { useState } from 'react';
import { X, HeartHandshake, UploadCloud, CheckCircle2, ShieldAlert, Phone, User, Calendar, MapPin, Send } from 'lucide-react';

interface SupportRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportRequestModal: React.FC<SupportRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    contactName: '',
    phone: '',
    relationship: 'Thân nhân Liệt sĩ',
    martyrName: '',
    yearOfBirth: '',
    yearOfSacrifice: '',
    hometown: '',
    unit: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/support-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setTicketSuccess(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#17052c] border border-cyan-500/40 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-lg font-bold cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base mb-1">
          <HeartHandshake className="w-5 h-5" />
          <span>LIÊN HỆ HỖ TRỢ PHỤC DỰNG DI ẢNH MIỄN PHÍ</span>
        </div>
        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          Chương trình hoàn toàn phi lợi nhuận dành riêng cho các gia đình Liệt sĩ, Mẹ Việt Nam Anh Hùng và Cựu chiến binh trên toàn quốc.
        </p>

        {ticketSuccess ? (
          <div className="p-6 rounded-2xl bg-cyan-950/40 border border-cyan-400/50 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Đã tiếp nhận yêu cầu phục dựng!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Mã hồ sơ: <span className="font-mono font-bold text-amber-300">{ticketSuccess.id}</span>
              </p>
              <p className="text-xs text-slate-300 mt-2">
                Ban kỹ thuật đồ họa và phục chế ảnh sẽ liên hệ với gia đình qua số điện thoại{' '}
                <span className="text-cyan-300 font-semibold">{ticketSuccess.phone}</span> trong vòng 24 - 48 giờ tới.
              </p>
            </div>
            <button
              onClick={() => {
                setTicketSuccess(null);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Hoàn tất & Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Contact Person Details */}
            <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-800/40 space-y-3">
              <h4 className="font-bold text-amber-300 text-[11px] uppercase tracking-wider">
                1. Thông tin người đại diện gia đình
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Họ tên người liên hệ *</label>
                  <input
                    required
                    type="text"
                    placeholder="VD: Bác Nguyễn Văn A"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Số điện thoại / Zalo *</label>
                  <input
                    required
                    type="tel"
                    placeholder="VD: 0912 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Mối quan hệ với Liệt sĩ</label>
                <select
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Con đẻ / Con nuôi">Con đẻ / Con nuôi</option>
                  <option value="Em ruột / Anh chị ruột">Em ruột / Anh chị ruột</option>
                  <option value="Cháu nội / ngoại">Cháu nội / ngoại</option>
                  <option value="Đồng đội / Cựu chiến binh">Đồng đội / Cựu chiến binh</option>
                </select>
              </div>
            </div>

            {/* Martyr Details */}
            <div className="p-4 rounded-xl bg-purple-900/20 border border-purple-800/40 space-y-3">
              <h4 className="font-bold text-amber-300 text-[11px] uppercase tracking-wider">
                2. Thông tin Anh hùng Liệt sĩ
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Họ và tên Liệt sĩ *</label>
                  <input
                    required
                    type="text"
                    placeholder="VD: Liệt sĩ Nguyễn Văn B"
                    value={formData.martyrName}
                    onChange={(e) => setFormData({ ...formData, martyrName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Năm sinh / Năm hy sinh</label>
                  <input
                    type="text"
                    placeholder="VD: 1949 – 1972"
                    value={formData.yearOfBirth}
                    onChange={(e) => setFormData({ ...formData, yearOfBirth: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Quê quán</label>
                  <input
                    type="text"
                    placeholder="VD: Huyện Triệu Phong, Quảng Trị"
                    value={formData.hometown}
                    onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Đơn vị / Chiến trường</label>
                  <input
                    type="text"
                    placeholder="VD: Sư đoàn 320, Mặt trận Tây Nguyên"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-black/50 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Mô tả tình trạng di ảnh & Nguyện vọng</label>
                <textarea
                  rows={2}
                  placeholder="Ảnh bị ố mờ, rách nếp gấp, mong muốn tô màu quân phục bộ đội..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/25"
            >
              <Send className="w-4 h-4 fill-slate-950" />
              <span>{isSubmitting ? 'Đang gửi hồ sơ...' : 'Gửi yêu cầu phục dựng miễn phí'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
