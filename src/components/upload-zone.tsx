"use client";

import { useCallback, useState, useRef } from "react";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  preview: string | null;
  fileName: string | null;
  onClear: () => void;
}

const ACCEPTED = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

export default function UploadZone({
  onFileSelected,
  disabled,
  preview,
  fileName,
  onClear,
}: UploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file) return;
      if (!ACCEPTED.includes(file.type)) {
        alert("Please upload a JPEG, PNG, or WebP image.");
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => setDragActive(false), []);

  if (preview) {
    return (
      <div className="animate-fade-in flex flex-col items-center gap-4 sm:gap-6">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-black/90 w-full shadow-2xl ring-1 ring-white/10">
          <div className="flex justify-center p-2 sm:p-4">
            <img
              src={preview}
              alt="Uploaded X-ray"
              className="max-h-[350px] sm:max-h-[450px] w-auto object-contain transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
        <div className="flex w-full items-center justify-between gap-3 rounded-2xl bg-card/80 px-4 py-3 ring-1 ring-border/50 backdrop-blur-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="truncate text-sm font-medium text-foreground">
              {fileName}
            </span>
          </div>
          <button
            onClick={onClear}
            disabled={disabled}
            className="flex shrink-0 items-center justify-center rounded-full bg-danger/10 px-3 py-1.5 text-xs font-bold text-danger transition-colors hover:bg-danger/20 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 sm:gap-6 rounded-[1.5rem] p-8 sm:p-12 transition-all duration-500 ease-out ${
        dragActive
          ? "bg-primary/10 scale-[1.02] ring-2 ring-primary/50 shadow-2xl shadow-primary/20"
          : "bg-background/50 hover:bg-background/80 ring-1 ring-border/50 hover:ring-primary/30 hover:shadow-xl hover:shadow-primary/5"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className={`relative flex h-20 w-20 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20 ${dragActive ? 'scale-110 bg-primary/20' : ''}`}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`relative z-10 text-primary transition-transform duration-500 sm:w-12 sm:h-12 ${dragActive ? '-translate-y-1' : 'group-hover:-translate-y-1'}`}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      <div className="text-center relative z-10">
        <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {dragActive ? "Drop your X-ray here" : "Upload a Chest X-ray"}
        </p>
        <p className="mt-2 text-sm sm:text-base text-muted">
          Drag & drop or click to browse
        </p>
      </div>

      <span className="mt-2 relative z-10 rounded-full bg-card px-4 py-1.5 text-xs font-medium text-muted ring-1 ring-border/50">
        JPEG, PNG, WebP up to 10MB
      </span>
    </div>
  );
}
