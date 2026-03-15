"use client";

import { useState, useCallback } from "react";
import Header from "@/components/header";
import UploadZone from "@/components/upload-zone";
import ResultsPanel from "@/components/results-panel";
import { predictImage, type PredictionResult } from "@/lib/api";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = useCallback(async (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    setLoading(true);
    try {
      const response = await predictImage(selectedFile);
      setResult(response.prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }, [preview]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 sm:gap-12 px-4 sm:px-6 py-6 sm:py-12 overflow-hidden">
        {/* Hero */}
        <section className="animate-fade-in text-center flex flex-col items-center">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground pb-2">
            Chest X-Ray Analysis
          </h2>
          <p className="mx-auto mt-2 sm:mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted px-2">
            Upload a chest X-ray image for instant AI pneumonia detection.
          </p>
        </section>

        {/* Main content: two-column on desktop */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12 w-full max-w-full">
          {/* Left column: Upload */}
          <section className="animate-slide-up w-full" style={{ animationDelay: '100ms', opacity: 0 }}>
            <div className="group relative h-full w-full overflow-hidden rounded-[2rem] bg-card p-5 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-border/50 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(13,148,136,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
              
              <div className="relative z-10">
                <UploadZone
                  onFileSelected={handleFileSelected}
                  disabled={loading}
                  preview={preview}
                  fileName={file?.name ?? null}
                  onClear={handleClear}
                />

                {preview && !loading && (
                  <button
                    onClick={() => file && handleFileSelected(file)}
                    className="mt-8 w-full relative overflow-hidden rounded-2xl bg-primary px-4 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:bg-primary-dark active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                    disabled={loading}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                      </svg>
                      Re-analyze Image
                    </span>
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Right column: Results */}
          <section className="animate-slide-up w-full" style={{ animationDelay: '200ms', opacity: 0 }}>
            <div className="group relative h-full w-full overflow-hidden rounded-[2rem] bg-card p-5 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-border/50 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
              
              <div className="relative z-10 h-full">
                <ResultsPanel result={result} loading={loading} error={error} />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border/40 bg-card/50 py-8 text-center backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-sm font-medium text-muted">
            Med-Vission <span className="mx-2 opacity-50">&bull;</span> AI-Powered Pneumonia Detection
          </p>
          <p className="mt-2 text-xs text-muted/70">
            For research and educational purposes only. Not for clinical use.
          </p>
        </div>
      </footer>
    </div>
  );
}
