import type { SurveyDefinition } from "@domain/survey";

export type { SurveyDefinition };

/**
 * POST `/api/surveys/:id/responses` の成功レスポンス。
 */
export type SubmitSurveyResponse = {
  /** サーバー側で採番された回答 ID */
  responseId: string;
  surveyId: string;
  /** ISO 8601 形式の受信日時 */
  receivedAt: string;
  /** エコーバック用の送信ペイロード */
  payload: unknown;
};

/**
 * API エラー時のレスポンス Body（4xx / 5xx）。
 */
export type ApiErrorBody = {
  message: string;
};
