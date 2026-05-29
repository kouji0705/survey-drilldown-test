export type { SurveyDefinitionV2 as SurveyDefinition } from "./surveyDefinition";

export type SubmitSurveyResponse = {
  responseId: string;
  surveyId: string;
  receivedAt: string;
  payload: unknown;
};

export type ApiErrorBody = {
  message: string;
};
