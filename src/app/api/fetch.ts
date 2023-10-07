import "client-only";
import type { ApiResponse } from "./response";

async function apiCall<T = unknown>(method: string, endPoint: string, data?: Record<string, unknown>, searchParams?: URLSearchParams): Promise<ApiResponse<T>> {
  const f = await fetch(`/api/${endPoint}${searchParams ? "?" + searchParams.toString() : ""}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await f.json();
}

export async function apiGet<T = unknown>(endPoint: string, data?: Record<string, string>): Promise<ApiResponse<T>> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(data ?? {})) {
    searchParams.set(key, value);
  }
  return apiCall("GET", endPoint, undefined, searchParams);
}

export async function apiPost(endPoint: string, data?: Record<string, unknown>): Promise<ApiResponse> {
  return apiCall("POST", endPoint, data);
}

export async function apiPatch(endPoint: string, data?: Record<string, unknown>): Promise<ApiResponse> {
  return apiCall("PATCH", endPoint, data);
}

export async function apiDelete(endPoint: string, data?: Record<string, unknown>): Promise<ApiResponse> {
  return apiCall("DELETE", endPoint, data);
}
