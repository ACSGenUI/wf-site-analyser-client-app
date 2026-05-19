#!/usr/bin/env node
/**
 * Generates a placeholder 512x512 app icon at build/icons/icon.png using only
 * Node.js built-ins (no extra dependencies).
 *
 * electron-builder reads this PNG and auto-converts it to .icns (macOS) and
 * .ico (Windows) during packaging.
 *
 * Replace build/icons/icon.png with real artwork before shipping to production.
 * The script skips generation if the file already exists so real artwork is
 * never overwritten.
 *
 * Usage:  node scripts/generate-icons.mjs
 */

import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const ICONS_DIR = 'build/icons';
const OUT_FILE = `${ICONS_DIR}/icon.png`;

if (existsSync(OUT_FILE)) {
  console.log(`${OUT_FILE} already exists — skipping placeholder generation.`);
  process.exit(0);
}

mkdirSync(ICONS_DIR, { recursive: true });

// ── CRC32 (required by the PNG chunk format) ──────────────────────────────────
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c;
}
function crc32(buf) {
  let crc = 0xffffffff;
  for (const byte of buf) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// ── PNG chunk serialiser ──────────────────────────────────────────────────────
function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.allocUnsafe(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.allocUnsafe(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

// ── Build a SIZE×SIZE solid-colour RGB PNG ────────────────────────────────────
function makeSolidPng(size, [r, g, b]) {
  // Each scanline: filter byte (0 = None) followed by SIZE × [R, G, B]
  const row = Buffer.allocUnsafe(1 + size * 3);
  row[0] = 0;
  for (let x = 0; x < size; x++) {
    row[1 + x * 3] = r;
    row[2 + x * 3] = g;
    row[3 + x * 3] = b;
  }
  // Repeat the row `size` times to fill the image
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  const compressed = deflateSync(raw, { level: 9 });

  const ihdr = Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(size, 0);  // width
  ihdr.writeUInt32BE(size, 4);  // height
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 2;   // colour type: RGB
  ihdr[10] = 0;  // compression method
  ihdr[11] = 0;  // filter method
  ihdr[12] = 0;  // interlace method

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Adobe Experience Cloud blue: #1473E6
const png = makeSolidPng(512, [0x14, 0x73, 0xe6]);
writeFileSync(OUT_FILE, png);
console.log(`Generated ${OUT_FILE} (512x512 placeholder — replace with real artwork before release)`);
