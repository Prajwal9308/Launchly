"use client";

import { useCallback, useState } from "react";

export interface UploadedFile {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: string;
}

export interface UploadItem {
  key: string;
  name: string;
  progress: number;
  error?: string;
  file?: UploadedFile;
}

/** Uploads files to /api/files with progress feedback (XHR gives upload progress). */
export function useUpload(projectId: string) {
  const [items, setItems] = useState<UploadItem[]>([]);

  const update = (key: string, patch: Partial<UploadItem>) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));

  const upload = useCallback(
    (file: File, category: string) =>
      new Promise<UploadedFile | null>((resolve) => {
        const key = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setItems((prev) => [...prev, { key, name: file.name, progress: 0 }]);
        const body = new FormData();
        body.append("file", file);
        body.append("projectId", projectId);
        body.append("category", category);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/files");
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) update(key, { progress: Math.round((e.loaded / e.total) * 100) });
        };
        xhr.onload = () => {
          let payload: { file?: UploadedFile; error?: string } = {};
          try {
            payload = JSON.parse(xhr.responseText);
          } catch {
            /* non-JSON error */
          }
          if (xhr.status >= 200 && xhr.status < 300 && payload.file) {
            update(key, { progress: 100, file: payload.file });
            resolve(payload.file);
          } else {
            update(key, { error: payload.error ?? "Unable to upload file." });
            resolve(null);
          }
        };
        xhr.onerror = () => {
          update(key, { error: "Unable to upload file. Check your connection and try again." });
          resolve(null);
        };
        xhr.send(body);
      }),
    [projectId],
  );

  const dismiss = (key: string) => setItems((prev) => prev.filter((i) => i.key !== key));
  const clear = () => setItems([]);

  return { items, upload, dismiss, clear };
}
