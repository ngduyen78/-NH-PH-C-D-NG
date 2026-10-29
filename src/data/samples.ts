// Authentic Historical Sample Portraits for Restoration Studio & Archive Gallery
// Supports 3 Distinct Restoration Modes: Black & White, Natural Color, and Historical Uniform Color

export type RestorationMode = 'bw' | 'natural' | 'historical';

export interface SamplePortrait {
  id: string;
  name: string;
  rank: string;
  year: string;
  hometown: string;
  story: string;
  era: string;
  uniformStyle: 'army' | 'guerrilla' | 'navy' | 'civilian';
  damagedSrc: string;
  restoredBwSrc: string;
  restoredNaturalSrc: string;
  restoredHistoricalSrc: string;
  isRealEvidence?: boolean;
  certificateSrc?: string;
}

export const samplePortraits: SamplePortrait[] = [
  {
    id: 'sample-evidence-1',
    name: 'Liệt sĩ Trần Ngọc Sâm',
    rank: 'Chính trị viên đại đội Quân đội nhân dân Việt Nam',
    year: 'Hy sinh ngày 16/03/1972 (Chiến trường Quảng Trị)',
    hometown: 'Xã Vĩnh Liêm, khu vực Vĩnh Linh, Quảng Trị',
    story: 'Minh chứng phục chế thiêng liêng: Bức di ảnh gốc của Liệt sĩ Trần Ngọc Sâm – Chính trị viên đại đội QĐND Việt Nam, người con ưu tú của quê hương Vĩnh Liêm, Vĩnh Linh, Quảng Trị hy sinh ngày 16/03/1972 trong sự nghiệp chống Mỹ cứu nước (Quyết định số 393 TTg ngày 30/7/1974, Bằng Tổ Quốc Ghi Công số NR 114b do Thủ tướng Phạm Văn Đồng ký). Di ảnh gốc bị rách góc, ố vàng và xước rách qua hơn 50 năm nay đã được phục hồi chi tiết, sống động.',
    era: 'Kháng chiến chống Mỹ cứu nước',
    uniformStyle: 'army',
    damagedSrc: '/portrait_damaged_original.png',
    restoredBwSrc: '/portrait_restored_bw.png',
    restoredNaturalSrc: '/portrait_restored_natural.png',
    restoredHistoricalSrc: '/portrait_restored_clean.png',
    isRealEvidence: true,
    certificateSrc: '/public/assets/aistudio/ls_s_M_-TH_M_c5ba7ac1.jpg',
  },
  {
    id: 'sample-dang-thuy-tram',
    name: 'Bác sĩ Đặng Thùy Trâm',
    rank: 'Liệt sĩ, Bác sĩ chiến trường Đức Phổ',
    year: '1942 – 1970 (Quảng Ngãi)',
    hometown: 'Hà Nội',
    story: 'Tác giả của những trang nhật ký bất tử rực lửa thanh xuân và tình thương đồng bào. Di ảnh phục dựng màu tự nhiên trong trẻo, ánh mắt sáng và nụ cười hiền hậu của người nữ trí thức kiên cường.',
    era: 'Kháng chiến chống Mỹ cứu nước',
    uniformStyle: 'civilian',
    damagedSrc: '/hero_dang_thuy_tram_damaged.png',
    restoredBwSrc: '/hero_dang_thuy_tram_bw.png',
    restoredNaturalSrc: '/hero_dang_thuy_tram.png',
    restoredHistoricalSrc: '/hero_dang_thuy_tram.png',
    isRealEvidence: true,
  },
  {
    id: 'sample-phan-vinh',
    name: 'AHLS Phan Vinh',
    rank: 'Liệt sĩ, Anh hùng LLVTND, Thuyền trưởng Tàu không số',
    year: '1933 – 1968 (Đoàn 125 Hải quân)',
    hometown: 'Điện Bàn, Quảng Nam',
    story: 'Người thuyền trưởng kiên cường của con tàu Không số C235 huyền thoại trên đường mòn Hồ Chí Minh trên biển, chiến đấu anh dũng đến viên đạn cuối cùng tại Hòn Hèo.',
    era: 'Kháng chiến chống Mỹ cứu nước',
    uniformStyle: 'navy',
    damagedSrc: '/hero_phan_vinh_damaged.png',
    restoredBwSrc: '/hero_phan_vinh_bw.png',
    restoredNaturalSrc: '/hero_phan_vinh.png',
    restoredHistoricalSrc: '/hero_phan_vinh.png',
    isRealEvidence: true,
  },
  {
    id: 'sample-nguyen-manh-minh',
    name: 'Liệt sĩ Nguyễn Mạnh Minh',
    rank: 'Chiến sĩ Thiếu niên Dũng cảm',
    year: '1953 – 1971 (Mặt trận Đường 9 Nam Lào)',
    hometown: 'Đông Anh, Hà Nội',
    story: 'Người chiến sĩ trẻ đội mũ cối bọc lưới, ánh mắt trong veo tràn đầy lý tưởng cách mạng, cống hiến trọn vẹn tuổi xuân vì độc lập dân tộc.',
    era: 'Kháng chiến chống Mỹ cứu nước',
    uniformStyle: 'army',
    damagedSrc: '/hero_nguyen_manh_minh_damaged.png',
    restoredBwSrc: '/hero_nguyen_manh_minh_bw.png',
    restoredNaturalSrc: '/hero_nguyen_manh_minh.png',
    restoredHistoricalSrc: '/hero_nguyen_manh_minh.png',
    isRealEvidence: true,
  },
  {
    id: 'sample-ho-si-canh',
    name: 'Liệt sĩ Hồ Sĩ Canh',
    rank: 'Chiến sĩ Pháo binh Cao xạ',
    year: '1947 – 1968 (Tuyến lửa Nghệ Tĩnh)',
    hometown: 'Quỳnh Lưu, Nghệ An',
    story: 'Kiên cường bám trận địa bảo vệ bầu trời quê hương, di ảnh phục dựng giữ trọn vẻ đẹp rắn rỏi và nụ cười ấm áp của người chiến sĩ pháo binh anh hùng.',
    era: 'Kháng chiến chống Mỹ cứu nước',
    uniformStyle: 'army',
    damagedSrc: '/hero_ho_si_canh_damaged.png',
    restoredBwSrc: '/hero_ho_si_canh_bw.png',
    restoredNaturalSrc: '/hero_ho_si_canh.png',
    restoredHistoricalSrc: '/hero_ho_si_canh.png',
    isRealEvidence: true,
  }
];
