import { describe, expect, it } from "vitest";
import { MAX_UPLOAD_BYTES, sanitizeFileName, validateUpload } from "@/domain/files";
import { PNG_BYTES } from "../helpers";

const pdf = new TextEncoder().encode("%PDF-1.7 test");

describe("file validation", () => {
  it("accepts a real PNG", () => {
    const result = validateUpload({ name: "logo.png", size: PNG_BYTES.length, bytes: PNG_BYTES });
    expect(result).toMatchObject({ ok: true, mimeType: "image/png", isImage: true });
  });

  it("accepts a PDF", () => {
    expect(validateUpload({ name: "menu.PDF", size: pdf.length, bytes: pdf }).ok).toBe(true);
  });

  it("rejects content that doesn't match the extension", () => {
    const fake = new TextEncoder().encode("<script>alert(1)</script>");
    expect(validateUpload({ name: "photo.png", size: fake.length, bytes: fake })).toEqual({ ok: false, error: "The file could not be verified. Please upload the original file again." });
  });

  it("rejects unsupported types", () => {
    expect(validateUpload({ name: "run.exe", size: 10, bytes: new Uint8Array(10) }).ok).toBe(false);
    expect(validateUpload({ name: "page.html", size: 10, bytes: new Uint8Array(10) }).ok).toBe(false);
  });

  it("rejects files over the size limit", () => {
    const result = validateUpload({ name: "big.pdf", size: MAX_UPLOAD_BYTES + 1, bytes: pdf });
    expect(result.ok).toBe(false);
  });

  it("rejects empty files", () => {
    expect(validateUpload({ name: "empty.pdf", size: 0, bytes: new Uint8Array() }).ok).toBe(false);
  });

  it("restricts to allowed extensions when given (design uploads)", () => {
    expect(validateUpload({ name: "doc.pdf", size: pdf.length, bytes: pdf, allowedExtensions: ["png"] }).ok).toBe(false);
  });

  it("detects SVG and rejects non-SVG text as SVG", () => {
    const svg = new TextEncoder().encode('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    expect(validateUpload({ name: "logo.svg", size: svg.length, bytes: svg }).ok).toBe(true);
    const html = new TextEncoder().encode("<html></html>");
    expect(validateUpload({ name: "logo.svg", size: html.length, bytes: html }).ok).toBe(false);
  });

  it("strips paths and unsafe characters from names", () => {
    expect(sanitizeFileName("../../etc/passwd")).toBe("passwd");
    expect(sanitizeFileName("C:\\Users\\me\\logo final<>.png")).toBe("logo final_.png");
  });
});
