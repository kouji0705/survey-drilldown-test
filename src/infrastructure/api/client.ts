import type { ApiErrorBody } from "./types";

/**
 * HTTP エラーを表す例外。
 *
 * {@link apiClient} が 2xx 以外のステータスで throw する。
 */
export class ApiError extends Error {
  /** HTTP ステータスコード */
  readonly status: number;

  /**
   * @param status - HTTP ステータス
   * @param message - 表示用メッセージ（API Body または statusText）
   */
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * JSON API 用の共通 fetch ラッパー。
 *
 * @typeParam T - レスポンス Body の型
 * @param path - `/api/...` 形式のパス（`VITE_API_BASE_URL` と結合）
 * @param init - `fetch` の第2引数
 * @returns パース済み JSON
 * @throws {@link ApiError} 2xx 以外
 */
export async function apiClient<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as Partial<ApiErrorBody>;
    throw new ApiError(res.status, body.message ?? res.statusText);
  }

  return res.json() as Promise<T>;
}
