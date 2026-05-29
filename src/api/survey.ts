import { apiClient } from "./client";
import type { SubmitSurveyResponse, SurveyDefinition } from "../types/api";
import type { SurveyInputs } from "../types/survey";

export function fetchSurveyDefinition(surveyId: string): Promise<SurveyDefinition> {
  return apiClient<SurveyDefinition>(`/api/surveys/${surveyId}`);
}

export function submitSurveyResponse(
  surveyId: string,
  payload: SurveyInputs,
): Promise<SubmitSurveyResponse> {
  return apiClient<SubmitSurveyResponse>(`/api/surveys/${surveyId}/responses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
