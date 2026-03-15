const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ClassProbability {
  class: string;
  probability: number;
}

export interface PredictionResult {
  predicted_class: "NORMAL" | "PNEUMONIA";
  confidence: number;
  probabilities: ClassProbability[];
}

export interface PredictResponse {
  success: boolean;
  filename: string;
  prediction: PredictionResult;
}

export interface HealthResponse {
  status: string;
  model_loaded: boolean;
  startup_error: string | null;
}

export async function checkHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error("API unreachable");
  return res.json();
}

export async function predictImage(file: File): Promise<PredictResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `Request failed (${res.status})`);
  }

  return res.json();
}
