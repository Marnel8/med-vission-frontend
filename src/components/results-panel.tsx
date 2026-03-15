"use client";

import type { PredictionResult } from "@/lib/api";

interface ResultsPanelProps {
  result: PredictionResult | null;
  loading: boolean;
  error: string | null;
}

function ProbabilityBar({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "success" | "danger";
}) {
  const pct = Math.round(value * 100);
  const barColor = variant === "success" ? "from-success to-success-light" : "from-danger to-danger-light";
  const textColor = variant === "success" ? "text-success-dark dark:text-success" : "text-danger-dark dark:text-danger";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">{label}</span>
        <span className={`font-mono font-bold ${textColor}`}>{pct}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-border/50 shadow-inner">
        <div
          className={`animate-progress-fill relative h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 w-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[300px] gap-5 py-12">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <div className="absolute inset-1 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
        <div className="absolute inset-4 rounded-full bg-primary/10" />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-foreground">Analyzing X-ray...</p>
        <p className="mt-1.5 text-sm text-muted">
          Running deep learning inference
        </p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-6 py-12 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border/50">
        <svg className="h-10 w-10 text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <div className="space-y-2 max-w-[280px]">
        <h3 className="text-xl font-bold tracking-tight text-foreground">Awaiting Image</h3>
        <p className="text-sm text-muted">
          Upload an X-ray scan on the left to see the AI analysis results here.
        </p>
      </div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="animate-fade-in rounded-xl border border-danger/30 bg-danger-light p-5">
      <div className="flex items-start gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 shrink-0 text-danger"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <p className="text-sm font-medium text-danger">Analysis Failed</p>
          <p className="mt-1 text-sm text-danger/80">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPanel({
  result,
  loading,
  error,
}: ResultsPanelProps) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!result) return <EmptyState />;

  const isNormal = result.predicted_class === "NORMAL";
  const normalProb =
    result.probabilities.find((p) => p.class === "NORMAL")?.probability ?? 0;
  const pneumoniaProb =
    result.probabilities.find((p) => p.class === "PNEUMONIA")?.probability ?? 0;

  return (
    <div className="animate-slide-up flex flex-col h-full space-y-6 sm:space-y-8">
      {/* Primary result */}
      <div
        className={`relative overflow-hidden rounded-[1.5rem] p-6 sm:p-8 shadow-sm ring-1 ${
          isNormal
            ? "bg-success/10 ring-success/30"
            : "bg-danger/10 ring-danger/30"
        }`}
      >
        <div className="absolute -right-8 -top-8 opacity-10 pointer-events-none">
          {isNormal ? (
            <svg width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="160" height="160" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </div>
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ${
            isNormal ? "bg-success text-white" : "bg-danger text-white"
          }`}>
            {isNormal ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            )}
          </div>
          <div>
            <p
              className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
                isNormal ? "text-success-dark dark:text-success" : "text-danger-dark dark:text-danger"
              }`}
            >
              {isNormal ? "Normal" : "Pneumonia"}
            </p>
            <p className={`mt-2 text-sm sm:text-base font-medium ${
              isNormal ? "text-success-dark/80 dark:text-success/80" : "text-danger-dark/80 dark:text-danger/80"
            }`}>
              {Math.round(result.confidence * 100)}% Confidence Score
            </p>
          </div>
        </div>
      </div>

      {/* Probability breakdown */}
      <div className="space-y-5">
        <h4 className="text-sm font-bold text-foreground">
          Detailed Breakdown
        </h4>
        <div className="space-y-4">
          <ProbabilityBar label="Normal" value={normalProb} variant="success" />
          <ProbabilityBar
            label="Pneumonia"
            value={pneumoniaProb}
            variant="danger"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Disclaimer */}
      <p className="text-xs leading-relaxed text-muted/70 text-center">
        This tool is for educational purposes only. Not a substitute for professional medical diagnosis.
      </p>
    </div>
  );
}
