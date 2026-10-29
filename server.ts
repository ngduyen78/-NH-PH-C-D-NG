import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '30mb' }));

// Initialize Google Gemini AI SDK
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// In-memory support requests database for martyr families
const supportRequests: Array<{
  id: string;
  name: string;
  contactName: string;
  phone: string;
  address: string;
  relationship: string;
  martyrName: string;
  yearOfBirth: string;
  yearOfSacrifice: string;
  hometown: string;
  unit: string;
  notes: string;
  imageUrl?: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}> = [
  {
    id: 'YC-2026-081',
    name: 'Nguyễn Văn Hòa',
    contactName: 'Bác Nguyễn Văn Hòa (em trai)',
    phone: '0982-xxx-412',
    address: 'Xã Hải Lăng, Tỉnh Quảng Trị',
    relationship: 'Em trai ruột',
    martyrName: 'Nguyễn Văn Minh',
    yearOfBirth: '1948',
    yearOfSacrifice: '1972',
    hometown: 'Hải Lăng, Quảng Trị',
    unit: 'Trung đoàn 9, Sư đoàn 304',
    notes: 'Di ảnh chụp vội trước khi xuất ngũ vào Thành Cổ, bị ố vàng góc trái và rách nhẹ giữa ngực áo.',
    status: 'processing',
    createdAt: '2026-10-27T10:15:00Z',
  },
  {
    id: 'YC-2026-082',
    name: 'Trần Thị Thu Cúc',
    contactName: 'Cô Thu Cúc (cháu gái)',
    phone: '0913-xxx-889',
    address: 'Thị xã Sơn Tây, Hà Nội',
    relationship: 'Cháu gái Liệt sĩ',
    martyrName: 'Trần Đình Khang',
    yearOfBirth: '1945',
    yearOfSacrifice: '1968',
    hometown: 'Sơn Tây, Hà Nội',
    unit: 'Binh trạm 31, Đoàn 559 Bộ đội Trường Sơn',
    notes: 'Ảnh chứng minh thư cũ kỹ, mong muốn phục hồi màu áo bộ đội Trường Sơn và làn da rạng rỡ của Bác.',
    status: 'completed',
    createdAt: '2026-10-25T14:20:00Z',
  }
];

// Historical memorial records
const memorialHeroes = [
  {
    id: 'LS-000',
    name: 'Trần Ngọc Sâm',
    birthYear: 'Chưa rõ',
    deathYear: '16/03/1972',
    hometown: 'Xã Vĩnh Liêm, khu vực Vĩnh Linh, Quảng Trị',
    role: 'Chính trị viên đại đội Quân đội nhân dân Việt Nam',
    burialSite: 'Nghĩa trang Liệt sĩ Vĩnh Linh / Quảng Trị',
    era: 'Kháng chiến chống Mỹ',
    story: 'Chính trị viên đại đội QĐND Việt Nam kiên cường, hy sinh ngày 16/3/1972 trong sự nghiệp chống Mỹ cứu nước. Quyết định số 393 TTg ngày 30/7/1974, Bằng Tổ Quốc Ghi Công số NR 114b do Thủ tướng Phạm Văn Đồng ký.',
    imagePrompt: 'Tran Ngoc Sam martyr portrait'
  },
  {
    id: 'LS-001',
    name: 'Võ Thị Sáu',
    birthYear: '1933',
    deathYear: '1952',
    hometown: 'Đất Đỏ, Bà Rịa - Vũng Tàu',
    role: 'Nữ Anh hùng Lực lượng Vũ trang Nhân dân',
    burialSite: 'Nghĩa trang Hàng Dương, Côn Đảo',
    era: 'Kháng chiến chống Pháp',
    story: 'Người nữ chiến sĩ thiếu niên kiên cường, bất khuất, biểu tượng người con gái Đất Đỏ trường tồn cùng non sông.',
    imagePrompt: 'Vo Thi Sau hero portrait'
  },
  {
    id: 'LS-002',
    name: 'Bế Văn Đàn',
    birthYear: '1931',
    deathYear: '1954',
    hometown: 'Quang Vinh, Trùng Khánh, Cao Bằng',
    role: 'Anh hùng Lực lượng Vũ trang Nhân dân',
    burialSite: 'Nghĩa trang Liệt sĩ Điện Biên Phủ',
    era: 'Kháng chiến chống Pháp',
    story: 'Lấy thân mình làm giá súng trong chiến dịch Điện Biên Phủ, tạo điểm tựa cho đồng đội nổ súng đánh tan quân địch.',
    imagePrompt: 'Be Van Dan hero portrait'
  },
  {
    id: 'LS-003',
    name: 'Nguyễn Viết Xuân',
    birthYear: '1933',
    deathYear: '1964',
    hometown: 'Ngũ Kiên, Vĩnh Tường, Vĩnh Phúc',
    role: 'Chính trị viên Đại đội 3 pháo cao xạ',
    burialSite: 'Nghĩa trang Liệt sĩ Vĩnh Phúc',
    era: 'Kháng chiến chống Mỹ',
    story: 'Khắc ghi khẩu lệnh bất tử: "Nhằm thẳng quân thù mà bắn!", truyền ngọn lửa chiến đấu kiên cường cho toàn mặt trận.',
    imagePrompt: 'Nguyen Viet Xuan hero portrait'
  },
  {
    id: 'LS-004',
    name: '10 Cô Gái Ngã Ba Đồng Lộc',
    birthYear: '1944-1951',
    deathYear: '1968',
    hometown: 'Can Lộc & các huyện Hà Tĩnh',
    role: 'Tiểu đội 4 Thanh niên xung phong (Võ Thị Tần làm Tiểu đội trưởng)',
    burialSite: 'Khu di tích lịch sử Quốc gia Ngã ba Đồng Lộc, Hà Tĩnh',
    era: 'Kháng chiến chống Mỹ',
    story: '10 bông hoa trinh liệt cống hiến tuổi xuân kiên cường thông đường nối hậu phương và tiền tuyến miền Nam.',
    imagePrompt: 'Dong Loc 10 heroines portrait'
  },
  {
    id: 'LS-005',
    name: 'Nguyễn Văn Trỗi',
    birthYear: '1940',
    deathYear: '1964',
    hometown: 'Điện Bàn, Quảng Nam',
    role: 'Anh hùng Lực lượng Vũ trang Nhân dân',
    burialSite: 'Nghĩa trang Liệt sĩ TP. Hồ Chí Minh',
    era: 'Kháng chiến chống Mỹ',
    story: 'Phút cuối cùng hiên ngang trên pháp trường Chí Hòa, hô vang lời thề bảo vệ Tổ quốc.',
    imagePrompt: 'Nguyen Van Troi hero portrait'
  },
  {
    id: 'LS-006',
    name: 'Đặng Thùy Trâm',
    birthYear: '1942',
    deathYear: '1970',
    hometown: 'Hà Nội',
    role: 'Bác sĩ, Liệt sĩ chiến trường Đức Phổ (Quảng Ngãi)',
    burialSite: 'Nghĩa trang Liệt sĩ Xuân Phương, Hà Nội',
    era: 'Kháng chiến chống Mỹ',
    story: 'Tác giả của những trang nhật ký bất tử rực lửa lý tưởng cách mạng và trái tim thương yêu thương đồng bào sâu sắc.',
    imagePrompt: 'Dang Thuy Tram hero portrait'
  }
];

// Memorial locations across Vietnam
const memorialLocations = [
  { id: 'LOC-01', name: 'Nghĩa trang Liệt sĩ Quốc gia Trường Sơn', province: 'Quảng Trị', lat: 16.920, lng: 106.980, count: '10.263 Liệt sĩ', restoredCount: 1420 },
  { id: 'LOC-02', name: 'Nghĩa trang Liệt sĩ Quốc gia Đường 9', province: 'Quảng Trị', lat: 16.780, lng: 107.080, count: '10.800 Liệt sĩ', restoredCount: 1180 },
  { id: 'LOC-03', name: 'Khu di tích Lịch sử Ngã ba Đồng Lộc', province: 'Hà Tĩnh', lat: 18.256, lng: 105.789, count: 'Tiểu đội TNXP & Chiến sĩ', restoredCount: 940 },
  { id: 'LOC-04', name: 'Nghĩa trang Hàng Dương - Côn Đảo', province: 'Bà Rịa - Vũng Tàu', lat: 8.685, lng: 106.608, count: '1.922 Ngôi mộ', restoredCount: 860 },
  { id: 'LOC-05', name: 'Nghĩa trang Liệt sĩ Quốc gia Vị Xuyên', province: 'Hà Giang', lat: 22.766, lng: 104.991, count: '1.870 Liệt sĩ', restoredCount: 710 },
  { id: 'LOC-06', name: 'Đền Tưởng niệm Liệt sĩ Bến Dược', province: 'TP. Hồ Chí Minh', lat: 11.144, lng: 106.463, count: '45.639 Liệt sĩ', restoredCount: 2350 },
  { id: 'LOC-07', name: 'Nghĩa trang Liệt sĩ Đồi A1 - Điện Biên Phủ', province: 'Điện Biên', lat: 21.385, lng: 103.018, count: '644 Anh hùng Liệt sĩ', restoredCount: 520 },
  { id: 'LOC-08', name: 'Đài Tưởng niệm các Anh hùng Liệt sĩ Bắc Sơn', province: 'Hà Nội', lat: 21.037, lng: 105.836, count: 'Di tích Tưởng niệm Trung ương', restoredCount: 3100 },
];

// API: Search & list historical records
app.get('/api/memorial-heroes', (req, res) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const era = req.query.era as string || '';
  let filtered = memorialHeroes;

  if (era && era !== 'all') {
    filtered = filtered.filter(h => h.era === era);
  }
  if (query) {
    filtered = filtered.filter(h =>
      h.name.toLowerCase().includes(query) ||
      h.hometown.toLowerCase().includes(query) ||
      h.role.toLowerCase().includes(query) ||
      h.story.toLowerCase().includes(query)
    );
  }
  res.json({ success: true, data: filtered });
});

// API: Memorial locations
app.get('/api/memorial-locations', (_req, res) => {
  res.json({ success: true, data: memorialLocations });
});

// API: Get Support Requests
app.get('/api/support-requests', (_req, res) => {
  res.json({ success: true, data: supportRequests });
});

// API: Submit a support request
app.post('/api/support-requests', (req, res) => {
  const { contactName, phone, relationship, martyrName, yearOfBirth, yearOfSacrifice, hometown, unit, notes } = req.body;
  if (!contactName || !martyrName) {
    return res.status(400).json({ error: 'Vui lòng cung cấp họ tên người liên hệ và tên liệt sĩ.' });
  }

  const newTicket = {
    id: `YC-2026-${String(supportRequests.length + 83).padStart(3, '0')}`,
    name: contactName,
    contactName,
    phone: phone || 'Đang cập nhật',
    address: hometown || 'Việt Nam',
    relationship: relationship || 'Thân nhân Liệt sĩ',
    martyrName,
    yearOfBirth: yearOfBirth || 'Không rõ',
    yearOfSacrifice: yearOfSacrifice || 'Không rõ',
    hometown: hometown || 'Việt Nam',
    unit: unit || 'Đang xác minh',
    notes: notes || 'Yêu cầu phục dựng di ảnh gia đình',
    status: 'pending' as const,
    createdAt: new Date().toISOString()
  };

  supportRequests.unshift(newTicket);
  res.json({ success: true, data: newTicket, message: 'Đã tiếp nhận yêu cầu phục dựng di ảnh thành công! Ban điều phối sẽ liên hệ sớm nhất.' });
});

// API: AI Gemini Historical Photo & Uniform Analysis
app.post('/api/ai/analyze-photo', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', eraHint, soldierRoleHint } = req.body;

    if (!ai) {
      // Fallback structured response if GEMINI_API_KEY is not set yet
      return res.json({
        success: true,
        source: 'local_expert_engine',
        analysis: {
          historicalEra: eraHint || 'Kháng chiến chống Mỹ cứu nước (1965 - 1975)',
          uniformType: 'Quân phục Lục quân Quân đội Nhân dân Việt Nam màu xanh cỏ úa truyền thống, cổ bẻ, cầu vai ve áo cờ đỏ sao vàng',
          headwear: 'Mũ cối tráng men bọc lưới ngụy trang hoặc mũ tai bèo Quân Giải Phóng miền Nam',
          damageTypes: ['Ố vàng phai màu theo thời gian', 'Xước hạt xước sọc dọc', 'Độ tương phản thấp mờ nét mặt'],
          recommendedColors: {
            uniform: '#3a5a40 (Xanh cỏ úa bộ đội)',
            collarBadge: '#c1121f (Đỏ tươi phù hiệu)',
            star: '#f59e0b (Vàng đồng sao sáng)',
            skinTone: '#f4d0b2 (Da vàng Á Đông tự nhiên)',
            background: '#354f52 (Hậu cảnh studio quân đội xưa)'
          },
          historicalContext: 'Bức ảnh mang đậm dấu ấn lịch sử của thế hệ thanh niên Việt Nam xếp bút nghiên lên đường đánh giặc, ánh mắt kiên định, nụ cười thanh xuân hiến dâng cho Tổ quốc.',
          tributeVerse: 'Có những nụ cười hóa thành bất tử\nNgát hương hoa thắm giữa Trường Sơn xanh\nĐất mẹ ôm anh vào lòng muôn thuở\nKhắc ghi tên anh sáng mãi muôn đời.'
        }
      });
    }

    const prompt = `Bạn là chuyên gia sử học và phục dựng di ảnh liệt sĩ, chiến sĩ Việt Nam ("Những Gương Mặt Bất Tử"). 
Hãy phân tích bức ảnh chân dung lịch sử được cung cấp (hoặc thông tin gợi ý: thời kỳ "${eraHint || 'thời kỳ chiến tranh bảo vệ Tổ quốc'}", vị trí "${soldierRoleHint || 'Bộ đội / Liệt sĩ'}").

Trả về định dạng JSON thuần túy (không dùng markdown codeblock, chỉ trả về JSON hợp lệ) với cấu trúc:
{
  "historicalEra": "Tên thời kỳ lịch sử (VD: Kháng chiến chống Mỹ 1965-1975, Kháng chiến chống Pháp 1946-1954, v.v.)",
  "uniformType": "Chi tiết quân phục chuẩn lịch sử (màu sắc, cổ áo, ve áo, quân hiệu)",
  "headwear": "Mũ (mũ cối, mũ tai bèo, mũ nồi, v.v.)",
  "damageTypes": ["Vết rách/xước", "Ố vàng", "Mất nét khuôn mặt"],
  "recommendedColors": {
    "uniform": "mã HEX hoặc mô tả (VD: Xanh cỏ úa #3d5a40)",
    "collarBadge": "mã HEX ve áo đỏ #c1121f",
    "star": "Sao vàng #f59e0b",
    "skinTone": "Tone da tự nhiên #f5d3b3",
    "background": "Tone phông nền #2c3e50"
  },
  "historicalContext": "2-3 câu bình luận trang trọng về ý nghĩa lịch sử của bức ảnh",
  "tributeVerse": "Một khổ thơ 4 câu ca ngợi sự hy sinh và vẻ đẹp thanh xuân của người anh hùng"
}`;

    const parts: any[] = [];
    if (imageBase64) {
      // Remove header if contains data:image/...;base64,
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType
        }
      });
    }
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        historicalEra: 'Kháng chiến chống Mỹ cứu nước (1965 - 1975)',
        uniformType: 'Quân phục Quân đội Nhân dân Việt Nam màu xanh cỏ úa, ve áo cờ đỏ sao vàng',
        headwear: 'Mũ cối hoặc mũ tai bèo Quân Giải phóng',
        damageTypes: ['Xước film', 'Ố vàng hóa chất', 'Mất độ nét vùng mắt'],
        recommendedColors: {
          uniform: '#3a5a40',
          collarBadge: '#c1121f',
          star: '#f59e0b',
          skinTone: '#f4d0b2',
          background: '#2b3a42'
        },
        historicalContext: 'Chân dung người chiến sĩ với nụ cười thanh thản và ý chí kiên cường vì độc lập tự do của non sông đất nước.',
        tributeVerse: 'Nguyện đem xương máu tô thắm cờ hoa\nCho đất mẹ reo vang khúc khải hoàn ca.'
      };
    }

    res.json({
      success: true,
      source: 'gemini-3.8-flash',
      analysis: parsedData
    });
  } catch (error: any) {
    console.error('Error analyzing photo with Gemini:', error);
    res.status(500).json({
      error: 'Không thể phân tích ảnh lúc này',
      details: error?.message
    });
  }
});

// Setup Vite middleware in dev or static serving in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
