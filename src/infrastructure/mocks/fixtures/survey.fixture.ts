import type { SurveyDefinition } from "@domain/survey";
import sample from "./survey.sample.json";

/**
 * 開発用 MSW が返すアンケート定義の fixture。
 *
 * 実 API も同スキーマの JSON を返す想定。
 */
export const surveyFixture: SurveyDefinition = sample as SurveyDefinition;
