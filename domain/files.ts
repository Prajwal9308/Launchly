import type { FileCategory } from "@/db/enums";

/**
 * Upload validation. The declared MIME type is never trusted on its own —
 * the file's leading bytes must match the type implied by its extension.
 */

/**
 * Vercel functions accept request bodies up to ~4.5 MB, so uploads are capped
 * at 4 MB there. NEXT_PUBLIC_VERCEL_ENV is set automatically on Vercel and is
 * inlined at build time, so the browser and server agree on the limit.
 */
const ON_VERCEL = Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV);
export const MAX_UPLOAD_BYTES = (ON_VERCEL ? 4 : 15) * 1024 * 1024;
export const MAX_DESIGN_UPLOAD_BYTES = (ON_VERCEL ? 4 : 25) * 1024 * 1024;

type Signature = (bytes: Uint8Array) => boolean;

const startsWith =
  (...sig: number[]): Signature =>
  (b) =>
    sig.every((byte, i) => b[i] === byte);

const isPdf = startsWith(0x25, 0x50, 0x44, 0x46); // %PDF
const isPng = startsWith(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
const isJpeg = startsWith(0xff, 0xd8, 0xff);
const isGif = startsWith(0x47, 0x49, 0x46, 0x38); // GIF8
const isWebp: Signature = (b) =>
  startsWith(0x52, 0x49, 0x46, 0x46)(b) && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
const isZip = startsWith(0x50, 0x4b, 0x03, 0x04); // DOCX/XLSX/PPTX containers
const isOle = startsWith(0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1); // legacy DOC/XLS

const isText: Signature = (b) => {
  const sample = b.subarray(0, 1024);
  return !sample.includes(0);
};

const isSvg: Signature = (b) => {
  if (!isText(b)) return false;
  const head = new TextDecoder().decode(b.subarray(0, 1024)).trimStart().toLowerCase();
  return head.startsWith("<svg") || (head.startsWith("<?xml") && head.includes("<svg"));
};

interface AllowedType {
  mime: string;
  check: Signature;
  image: boolean;
}

export const ALLOWED_TYPES: Record<string, AllowedType> = {
  pdf: { mime: "application/pdf", check: isPdf, image: false },
  png: { mime: "image/png", check: isPng, image: true },
  jpg: { mime: "image/jpeg", check: isJpeg, image: true },
  jpeg: { mime: "image/jpeg", check: isJpeg, image: true },
  gif: { mime: "image/gif", check: isGif, image: true },
  webp: { mime: "image/webp", check: isWebp, image: true },
  svg: { mime: "image/svg+xml", check: isSvg, image: true },
  doc: { mime: "application/msword", check: isOle, image: false },
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    check: isZip,
    image: false,
  },
  xls: { mime: "application/vnd.ms-excel", check: isOle, image: false },
  xlsx: { mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", check: isZip, image: false },
  pptx: {
    mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    check: isZip,
    image: false,
  },
  txt: { mime: "text/plain", check: isText, image: false },
};

export const ACCEPT_ATTRIBUTE = Object.keys(ALLOWED_TYPES)
  .map((ext) => `.${ext}`)
  .join(",");

/** Design previews must be viewable in the browser. */
export const DESIGN_EXTENSIONS = ["png", "jpg", "jpeg", "webp", "gif", "pdf"];
export const DESIGN_ACCEPT_ATTRIBUTE = DESIGN_EXTENSIONS.map((e) => `.${e}`).join(",");

export function fileExtension(name: string) {
  const match = /\.([a-z0-9]+)$/i.exec(name.trim());
  return match ? match[1].toLowerCase() : "";
}

/** Strips paths and unsafe characters from a user-supplied filename. */
export function sanitizeFileName(name: string) {
  const base = name.split(/[\\/]/).pop() ?? "file";
  const cleaned = base
    .normalize("NFKC")
    .replace(/[^\w.\- ()]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .slice(-150);
  return cleaned || "file";
}

export type FileValidationResult =
  | { ok: true; mimeType: string; extension: string; isImage: boolean; name: string }
  | { ok: false; error: string };

export function validateUpload(input: {
  name: string;
  size: number;
  bytes: Uint8Array;
  allowedExtensions?: string[];
  maxBytes?: number;
}): FileValidationResult {
  const maxBytes = input.maxBytes ?? MAX_UPLOAD_BYTES;
  const name = sanitizeFileName(input.name);
  const extension = fileExtension(name);

  if (input.size <= 0 || input.bytes.length === 0) return { ok: false, error: "The file is empty." };
  if (input.size > maxBytes) {
    return { ok: false, error: `Files must be ${Math.round(maxBytes / (1024 * 1024))} MB or smaller.` };
  }

  const allowed = ALLOWED_TYPES[extension];
  if (!allowed || (input.allowedExtensions && !input.allowedExtensions.includes(extension))) {
    return { ok: false, error: "This file type isn't supported." };
  }
  if (!allowed.check(input.bytes)) {
    return { ok: false, error: "The file contents don't match its type." };
  }

  return { ok: true, mimeType: allowed.mime, extension, isImage: allowed.image, name };
}

export function isImageMime(mime: string) {
  return mime.startsWith("image/");
}

export const FILE_CATEGORY_LABELS: Record<FileCategory, string> = {
  LOGO: "Logo",
  PHOTO: "Photo",
  DOCUMENT: "Document",
  BRAND: "Brand guidelines",
  CONTENT: "Content",
  DESIGN: "Design",
  ATTACHMENT: "Message attachment",
  OTHER: "Other",
};

/** Categories a client may choose when uploading. DESIGN is studio-only. */
export const CLIENT_FILE_CATEGORIES: FileCategory[] = ["LOGO", "PHOTO", "DOCUMENT", "BRAND", "CONTENT", "ATTACHMENT", "OTHER"];
