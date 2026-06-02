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
import { crc32 as deflateSync } from 'node:zlib';

const BUILD_DIR = 'build';
const PNG_FILE = `${BUILD_DIR}/icons/icon.png`;
const ICO_FILE = `${BUILD_DIR}/icons/icon.ico`;

if (existsSync(PNG_FILE) && existsSync(ICO_FILE)) {
  process.exit(0);
}

mkdirSync(BUILD_DIR, { recursive: true });

// ── CRC32 (required by the PNG chunk format) ──────────────────────────────────
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
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

// ── Build a SIZE×SIZE solid-colour RGBA PNG ───────────────────────────────────
// app-builder (electron-builder's Go icon converter) requires colour type 6
// (RGBA). Colour type 2 (RGB) causes it to return {icons:null,isFallback:true},
// which then triggers a "index out of range [-1]" panic during EXE icon embedding.
function makeSolidPng(size, [r, g, b]) {
  // Each scanline: filter byte (0 = None) followed by SIZE × [R, G, B, A]
  const row = Buffer.alloc(1 + size * 4); // alloc (zero-filled) avoids uninitialised bytes
  row[0] = 0;
  for (let x = 0; x < size; x += 1) {
    row[1 + x * 4] = r;
    row[2 + x * 4] = g;
    row[3 + x * 4] = b;
    row[4 + x * 4] = 0xff; // fully opaque
  }
  // Repeat the row `size` times to fill the image
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  const compressed = deflateSync(raw, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); // width
  ihdr.writeUInt32BE(size, 4); // height
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── PNG-in-ICO wrapper ────────────────────────────────────────────────────────
// Windows ICO format supports embedded PNGs (Vista+). We embed a 256×256 RGBA
// PNG directly so no BMP conversion is needed and app-builder can decode it.
function makeIco(pngData) {
  const entry = Buffer.alloc(16);
  entry[0] = 0; // width  (0 = 256 in ICO spec)
  entry[1] = 0; // height (0 = 256 in ICO spec)
  entry[2] = 0; // color count
  entry[3] = 0; // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bit depth
  entry.writeUInt32LE(pngData.length, 8); // byte length of PNG data
  entry.writeUInt32LE(6 + 16, 12); // offset: ICONDIR(6) + ICONDIRENTRY(16)

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(1, 4); // image count

  return Buffer.concat([header, entry, pngData]);
}

// Adobe Experience Cloud blue: #1473E6
const COLOR = [0x14, 0x73, 0xe6];

if (!existsSync(PNG_FILE)) {
  writeFileSync(PNG_FILE, makeSolidPng(512, COLOR));
}

if (!existsSync(ICO_FILE)) {
  // 256×256 is the minimum size app-builder accepts for ICO conversion.
  writeFileSync(ICO_FILE, makeIco(makeSolidPng(256, COLOR)));
}
