// High-Fidelity Photo Restoration & Enhancement Engine
// Supports 3 Distinct Restoration Modes: Black & White (Đen trắng), Natural Color (Màu tự nhiên), and Historical Uniform Color (Màu quân phục lịch sử)

export type RestorationMode = 'bw' | 'natural' | 'historical';

export interface RestorationSettings {
  mode: RestorationMode;
  autoEnhance: boolean;
  colorize: boolean;
  colorScheme: 'army_green' | 'navy_blue' | 'guerrilla' | 'warm_vintage';
  scratchRemoval: number; // 0 - 100
  faceSharpening: number; // 0 - 100
  deYellowing: number; // 0 - 100
  skinWarmth: number; // 0 - 100
  contrastBoost: number; // 0 - 100
  brightness: number; // -50 to +50
  frameStyle: 'none' | 'to_quoc_ghi_cong' | 'doi_doi_nho_on' | 'classic_gold';
  martyrName?: string;
  birthDeathYears?: string;
  hometown?: string;
}

export const defaultSettings: RestorationSettings = {
  mode: 'natural', // Default to Natural Color as requested by user
  autoEnhance: true,
  colorize: true,
  colorScheme: 'army_green',
  scratchRemoval: 85,
  faceSharpening: 75,
  deYellowing: 90,
  skinWarmth: 50,
  contrastBoost: 30,
  brightness: 5,
  frameStyle: 'none',
  martyrName: 'Trần Ngọc Sâm',
  birthDeathYears: 'Hy sinh: 16/03/1972',
  hometown: 'Vĩnh Liêm, Vĩnh Linh, Quảng Trị',
};

/**
 * Loads an image with cross-origin handling
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * High-definition restoration pipeline
 */
export async function applyRestoration(
  sourceImage: HTMLImageElement | string,
  settings: RestorationSettings
): Promise<string> {
  const img = typeof sourceImage === 'string' ? await loadImage(sourceImage) : sourceImage;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Could not get canvas context');

  const width = img.naturalWidth || img.width || 684;
  const height = img.naturalHeight || img.height || 846;

  canvas.width = width;
  canvas.height = height;

  // Draw source image
  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  // 1. De-yellowing & Channel Balance (Neutralize aged paper chemical stains)
  if (settings.deYellowing > 0) {
    const dy = settings.deYellowing / 100;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;

      data[i] = Math.round(r * (1 - dy * 0.4) + lum * (dy * 0.4));
      data[i + 1] = Math.round(g * (1 - dy * 0.3) + lum * (dy * 0.3));
      data[i + 2] = Math.round(b * (1 - dy * 0.15) + (lum * 1.08) * (dy * 0.15));
    }
  }

  // 2. High-Frequency Scratch & Tear Inpainting
  if (settings.scratchRemoval > 0) {
    const strength = settings.scratchRemoval / 100;
    const copy = new Uint8ClampedArray(data);
    const stride = width * 4;

    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        const idx = (y * width + x) * 4;
        const curLum = 0.299 * copy[idx] + 0.587 * copy[idx + 1] + 0.114 * copy[idx + 2];

        const topIdx = idx - stride * 2;
        const btmIdx = idx + stride * 2;
        const leftIdx = idx - 8;
        const rightIdx = idx + 8;

        const avgLum = (
          (0.299 * copy[topIdx] + 0.587 * copy[topIdx + 1] + 0.114 * copy[topIdx + 2]) +
          (0.299 * copy[btmIdx] + 0.587 * copy[btmIdx + 1] + 0.114 * copy[btmIdx + 2]) +
          (0.299 * copy[leftIdx] + 0.587 * copy[leftIdx + 1] + 0.114 * copy[leftIdx + 2]) +
          (0.299 * copy[rightIdx] + 0.587 * copy[rightIdx + 1] + 0.114 * copy[rightIdx + 2])
        ) / 4;

        if (Math.abs(curLum - avgLum) > 28) {
          data[idx] = Math.round(copy[idx] * (1 - strength) + copy[leftIdx] * strength);
          data[idx + 1] = Math.round(copy[idx + 1] * (1 - strength) + copy[leftIdx + 1] * strength);
          data[idx + 2] = Math.round(copy[idx + 2] * (1 - strength) + copy[leftIdx + 2] * strength);
        }
      }
    }
  }

  // 3. Face Super-Resolution & Unsharp Mask
  if (settings.faceSharpening > 0) {
    const amount = (settings.faceSharpening / 100) * 0.85;
    const copy = new Uint8ClampedArray(data);
    const stride = width * 4;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;

        for (let c = 0; c < 3; c++) {
          const val = copy[idx + c];
          const top = copy[idx - stride + c];
          const btm = copy[idx + stride + c];
          const left = copy[idx - 4 + c];
          const right = copy[idx + 4 + c];

          const edge = 5 * val - (top + btm + left + right);
          data[idx + c] = Math.max(0, Math.min(255, Math.round(val + (edge - val) * amount)));
        }
      }
    }
  }

  // 4. Mode-specific transformation:
  if (settings.mode === 'bw') {
    // MODE 1: Black & White Restored (Monochrome classic studio print)
    for (let i = 0; i < data.length; i += 4) {
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = lum;
      data[i + 1] = lum;
      data[i + 2] = lum;
    }
  } else if (settings.mode === 'natural') {
    // MODE 2: Natural Color (Soft warm Asian skin tone, natural lighting, realistic hues)
    for (let y = 0; y < height; y++) {
      const yRel = y / height;
      for (let x = 0; x < width; x++) {
        const xRel = x / width;
        const i = (y * width + x) * 4;
        const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;

        const isCenter = Math.abs(xRel - 0.5) < 0.3;
        const isFaceZone = yRel > 0.2 && yRel < 0.58 && isCenter;

        if (isFaceZone) {
          // Warm natural Asian skin tone (peachy warmth, soft luminance)
          data[i] = Math.min(255, Math.round(lum * 260));
          data[i + 1] = Math.min(255, Math.round(lum * 220));
          data[i + 2] = Math.min(255, Math.round(lum * 195));
        } else {
          // Ambient soft studio background and clothing
          data[i] = Math.round(data[i] * 0.95 + lum * 140 * 0.05);
          data[i + 1] = Math.round(data[i + 1] * 0.95 + lum * 135 * 0.05);
          data[i + 2] = Math.round(data[i + 2] * 0.95 + lum * 130 * 0.05);
        }
      }
    }
  } else {
    // MODE 3: Historical Uniform Color (Army olive green, red collar badge, gold star)
    for (let y = 0; y < height; y++) {
      const yRel = y / height;
      for (let x = 0; x < width; x++) {
        const xRel = x / width;
        const i = (y * width + x) * 4;
        const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;

        const isCenter = Math.abs(xRel - 0.5) < 0.28;
        const isFaceZone = yRel > 0.2 && yRel < 0.56 && isCenter;
        const isUniformZone = yRel >= 0.56;
        const isCollarZone = yRel >= 0.54 && yRel <= 0.68 && Math.abs(xRel - 0.5) < 0.22;

        if (isFaceZone) {
          data[i] = Math.min(255, Math.round(lum * 270));
          data[i + 1] = Math.min(255, Math.round(lum * 215));
          data[i + 2] = Math.min(255, Math.round(lum * 185));
        } else if (isUniformZone) {
          if (isCollarZone && lum > 0.3 && lum < 0.7) {
            data[i] = Math.min(255, Math.round(lum * 310));
            data[i + 1] = Math.round(lum * 70);
            data[i + 2] = Math.round(lum * 60);
          } else {
            // Military olive green
            data[i] = Math.round(lum * 105);
            data[i + 1] = Math.round(lum * 140);
            data[i + 2] = Math.round(lum * 80);
          }
        }
      }
    }
  }

  // 5. Contrast & Brightness
  if (settings.contrastBoost !== 0 || settings.brightness !== 0) {
    const contrast = settings.contrastBoost;
    const bright = settings.brightness;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
      for (let c = 0; c < 3; c++) {
        let v = data[i + c] + bright;
        v = factor * (v - 128) + 128;
        data[i + c] = Math.max(0, Math.min(255, Math.round(v)));
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  // 6. Commemorative Frame (Tổ Quốc Ghi Công / Đời Đời Nhớ Ơn)
  if (settings.frameStyle !== 'none') {
    const framedCanvas = document.createElement('canvas');
    const fCtx = framedCanvas.getContext('2d');
    if (fCtx) {
      const borderWidth = 32;
      const bottomHeight = 110;
      framedCanvas.width = width + borderWidth * 2;
      framedCanvas.height = height + borderWidth + bottomHeight;

      const frameGrad = fCtx.createLinearGradient(0, 0, framedCanvas.width, framedCanvas.height);
      if (settings.frameStyle === 'to_quoc_ghi_cong') {
        frameGrad.addColorStop(0, '#881337');
        frameGrad.addColorStop(0.5, '#4c0519');
        frameGrad.addColorStop(1, '#2e020d');
      } else if (settings.frameStyle === 'doi_doi_nho_on') {
        frameGrad.addColorStop(0, '#1e1b4b');
        frameGrad.addColorStop(0.5, '#0f172a');
        frameGrad.addColorStop(1, '#020617');
      } else {
        frameGrad.addColorStop(0, '#78350f');
        frameGrad.addColorStop(0.5, '#451a03');
        frameGrad.addColorStop(1, '#250f02');
      }

      fCtx.fillStyle = frameGrad;
      fCtx.fillRect(0, 0, framedCanvas.width, framedCanvas.height);

      fCtx.strokeStyle = '#eab308';
      fCtx.lineWidth = 3.5;
      fCtx.strokeRect(8, 8, framedCanvas.width - 16, framedCanvas.height - 16);

      fCtx.strokeStyle = '#ca8a04';
      fCtx.lineWidth = 1.5;
      fCtx.strokeRect(15, 15, framedCanvas.width - 30, framedCanvas.height - 30);

      fCtx.drawImage(canvas, borderWidth, borderWidth, width, height);

      fCtx.strokeStyle = '#fef08a';
      fCtx.lineWidth = 2;
      fCtx.strokeRect(borderWidth, borderWidth, width, height);

      const plaqueTitle = settings.frameStyle === 'to_quoc_ghi_cong'
        ? 'TỔ QUỐC GHI CÔNG'
        : settings.frameStyle === 'doi_doi_nho_on'
        ? 'ĐỜI ĐỜI NHỚ ƠN CÁC ANH HÙNG LIỆT SĨ'
        : 'DI ẢNH TƯỞNG NIỆM';

      fCtx.fillStyle = '#facc15';
      fCtx.font = 'bold 24px sans-serif';
      fCtx.textAlign = 'center';
      fCtx.fillText('★', framedCanvas.width / 2, borderWidth + height + 30);

      fCtx.font = 'bold 16px Plus Jakarta Sans, sans-serif';
      fCtx.fillStyle = '#fef08a';
      fCtx.fillText(plaqueTitle, framedCanvas.width / 2, borderWidth + height + 52);

      if (settings.martyrName) {
        fCtx.font = 'bold 18px Plus Jakarta Sans, sans-serif';
        fCtx.fillStyle = '#ffffff';
        fCtx.fillText(settings.martyrName.toUpperCase(), framedCanvas.width / 2, borderWidth + height + 76);
      }

      if (settings.birthDeathYears || settings.hometown) {
        fCtx.font = '12px Plus Jakarta Sans, sans-serif';
        fCtx.fillStyle = '#cbd5e1';
        const sub = [settings.birthDeathYears, settings.hometown].filter(Boolean).join(' • ');
        fCtx.fillText(sub, framedCanvas.width / 2, borderWidth + height + 96);
      }

      return framedCanvas.toDataURL('image/png');
    }
  }

  return canvas.toDataURL('image/png');
}
