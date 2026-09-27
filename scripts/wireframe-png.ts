import { deflateSync } from "node:zlib";

/**
 * Generates simple website-wireframe PNGs without image dependencies.
 * Used for seeded design previews and test fixtures.
 */

type RGB = [number, number, number];

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf: Buffer) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

export function hexToRgb(hex: string): RGB {
  const v = hex.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

export function wireframePng(options: { accent: string; width?: number; height?: number; variant?: number }) {
  const width = options.width ?? 960;
  const height = options.height ?? 640;
  const accent = hexToRgb(options.accent);
  const soft: RGB = [accent[0] + (255 - accent[0]) * 0.88, accent[1] + (255 - accent[1]) * 0.88, accent[2] + (255 - accent[2]) * 0.88].map(Math.round) as RGB;
  const pixels = Buffer.alloc(width * height * 3, 255);

  const rect = (x: number, y: number, w: number, h: number, color: RGB) => {
    for (let yy = Math.max(0, y); yy < Math.min(height, y + h); yy++) {
      for (let xx = Math.max(0, x); xx < Math.min(width, x + w); xx++) {
        const i = (yy * width + xx) * 3;
        pixels[i] = color[0];
        pixels[i + 1] = color[1];
        pixels[i + 2] = color[2];
      }
    }
  };

  const gray: RGB = [229, 229, 232];
  const dark: RGB = [40, 40, 48];
  const mid: RGB = [180, 180, 188];

  // Navigation
  rect(0, 0, width, 64, [250, 250, 251]);
  rect(0, 64, width, 1, gray);
  rect(40, 22, 28, 20, accent);
  rect(80, 27, 110, 10, dark);
  for (let i = 0; i < 4; i++) rect(width - 420 + i * 80, 28, 56, 8, mid);
  rect(width - 110, 20, 72, 24, accent);

  // Hero
  const v = options.variant ?? 0;
  rect(0, 65, width, 300, soft);
  rect(40, 120, 380 - v * 20, 22, dark);
  rect(40, 152, 320, 22, dark);
  rect(40, 196, 360, 9, mid);
  rect(40, 214, 300, 9, mid);
  rect(40, 250, 130, 34, accent);
  rect(182, 250, 110, 34, [255, 255, 255]);
  rect(width / 2 + 40, 100, width / 2 - 80, 230, [255, 255, 255]);
  rect(width / 2 + 60, 120, width / 2 - 120, 150 - v * 10, gray);

  // Cards
  const cardW = (width - 40 * 2 - 24 * 2) / 3;
  for (let i = 0; i < 3; i++) {
    const x = Math.round(40 + i * (cardW + 24));
    rect(x, 400, cardW, 180, [255, 255, 255]);
    rect(x, 400, cardW, 1, gray);
    rect(x, 579, cardW, 1, gray);
    rect(x, 400, 1, 180, gray);
    rect(x + cardW - 1, 400, 1, 180, gray);
    rect(x + 20, 424, 32, 32, soft);
    rect(x + 20, 472, cardW * 0.6, 10, dark);
    rect(x + 20, 494, cardW * 0.8, 7, mid);
    rect(x + 20, 508, cardW * 0.7, 7, mid);
  }

  // Encode PNG (RGB, filter 0 per row)
  const raw = Buffer.alloc((width * 3 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 3 + 1)] = 0;
    pixels.copy(raw, y * (width * 3 + 1) + 1, y * width * 3, (y + 1) * width * 3);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // color type RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
