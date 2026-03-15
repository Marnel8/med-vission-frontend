"use client";

import { useEffect, useState } from "react";
import { checkHealth } from "@/lib/api";

export default function Header() {
  const [health, setHealth] = useState<{
    ok: boolean;
    modelLoaded: boolean;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const data = await checkHealth();
        if (!cancelled)
          setHealth({
            ok: data.status === "ok",
            modelLoaded: data.model_loaded,
          });
      } catch {
        if (!cancelled) setHealth(null);
      }
    };
    poll();
    const id = setInterval(poll, 15_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
          <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-primary shadow-sm transition-transform duration-500 group-hover:scale-105">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 text-white transition-transform duration-500 group-hover:rotate-12 w-5 h-5 sm:w-6 sm:h-6"
            >
              <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
              Med-Vission
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {health === null ? (
            <span className="flex items-center gap-1.5 rounded-full bg-danger-light px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-danger">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-danger" />
              </span>
              <span className="hidden sm:inline">API Offline</span>
              <span className="sm:hidden">Offline</span>
            </span>
          ) : health.modelLoaded ? (
            <span className="flex items-center gap-1.5 rounded-full bg-success-light px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-success">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-success" />
              </span>
              <span className="hidden sm:inline">Model Ready</span>
              <span className="sm:hidden">Ready</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-warning-light px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-medium text-warning">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-warning" />
              </span>
              <span className="hidden sm:inline">Model Loading</span>
              <span className="sm:hidden">Loading</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
