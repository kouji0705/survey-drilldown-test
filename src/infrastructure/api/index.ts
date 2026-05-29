/**
 * アンケート API のインフラ層公開 API。
 *
 * UI はこのモジュール経由でのみ HTTP アクセスする（Domain 型を再利用）。
 *
 * @packageDocumentation
 */

export { apiClient, ApiError } from "./client";
export { fetchSurveyDefinition, submitSurveyResponse } from "./surveyRepository";
export type { SurveyDefinition, SubmitSurveyResponse, ApiErrorBody } from "./types";
