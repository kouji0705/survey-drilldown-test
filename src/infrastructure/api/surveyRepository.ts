import { apiClient } from "./client";
import type { SubmitSurveyResponse, SurveyDefinition } from "./types";

/**
 * アンケート定義を取得する。
 *
 * @param surveyId - アンケート ID（例: `survey-001`）
 * @returns 描画・分岐に使う {@link SurveyDefinition}
 */
export function fetchSurveyDefinition(surveyId: string): Promise<SurveyDefinition> {
  return apiClient<SurveyDefinition>(`/api/surveys/${surveyId}`);
}

/**
 * 回答を送信する。
 *
 * @param surveyId - アンケート ID
 * @param payload - フォーム値（表示中フィールドのみ含む想定）
 * @returns 採番された responseId など
 */
export function submitSurveyResponse(
  surveyId: string,
  payload: Record<string, unknown>,
): Promise<SubmitSurveyResponse> {
  return apiClient<SubmitSurveyResponse>(`/api/surveys/${surveyId}/responses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
