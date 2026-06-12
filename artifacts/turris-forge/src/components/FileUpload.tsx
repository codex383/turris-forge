import { useState, useRef } from "react";
import { C } from "../data/seed";
import type { UploadedFile } from "../types";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB per file
const ALLOWED = ["image/", "application/pdf", "video/", "text/"];
const isAllowed = (f: File) => ALLOWED.some(t => f.type.startsWith(t));

function formatSize(b: number) {
  if (b < 1024) return `${b}B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)}KB`;
  return `${(b / 1024 / 1024).toFixed(1)}MB`;
}

const EXT_ICON: Record<string, string> = {
  "image": "🖼", "video": "🎬", "application/pdf": "📄", "text": "📝",
};
function fileIcon(type: string) {
  for (const [k, v] of Object.entries(EXT_ICON)) if (type.startsWith(k)) return v;
  return "📎";
}

export function FileUpload({ files, setFiles }: { files: UploadedFile[]; setFiles: (f: UploadedFile[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const addFiles = (raw: FileList | null) => {
    if (!raw) return;
    setError("");
    const promises: Promise<UploadedFile>[] = [];
    Array.from(raw).forEach(f => {
      if (!isAllowed(f)) { setError(`${f.name}: file type not supported`); return; }
      if (f.size > MAX_SIZE) { setError(`${f.name}: too large (max 10MB)`); return; }
      promises.push(new Promise((res) => {
        const reader = new FileReader();
        reader.onload = () => res({ name: f.name, size: f.size, type: f.type, dataUrl: reader.result as string });
        reader.readAsDataURL(f);
      }));
    });
    Promise.all(promises).then(newFiles => setFiles([...files, ...newFiles]));
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? C.gold : C.cyan + "44"}`,
          borderRadius: 10, padding: "22px 16px", textAlign: "center",
          cursor: "pointer", background: dragging ? `${C.gold}08` : `${C.cyan}05`,
          transition: "all .2s",
        }}
      >
        <div style={{ fontSize: 28, marginBottom: 6 }}>📂</div>
        <div style={{ fontSize: 13, color: dragging ? C.gold : C.ash, fontWeight: 600 }}>
          {dragging ? "Drop to attach" : "Drag & drop files, or click to browse"}
        </div>
        <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>Images, PDFs, videos, text files · Max 10MB each</div>
      </div>
      <input ref={inputRef} type="file" multiple accept="image/*,application/pdf,video/*,text/*" onChange={e => addFiles(e.target.files)} style={{ display: "none" }} />

      {error && <div style={{ marginTop: 8, fontSize: 12, color: C.ember }}>{error}</div>}

      {/* Attached list */}
      {files.length > 0 && (
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
              background: C.sur2, borderRadius: 7, border: `1px solid #ffffff08`,
            }}>
              {f.type.startsWith("image") ? (
                <img src={f.dataUrl} alt={f.name} style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
              ) : (
                <span style={{ fontSize: 24, flexShrink: 0 }}>{fileIcon(f.type)}</span>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: C.ash, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
                <div style={{ fontSize: 10, color: C.gray }}>{formatSize(f.size)}</div>
              </div>
              <button onClick={() => setFiles(files.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: C.gray, cursor: "pointer", fontSize: 14, padding: "0 4px", transition: "color .15s" }} onMouseEnter={e => (e.currentTarget.style.color = C.ember)} onMouseLeave={e => (e.currentTarget.style.color = C.gray)}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
