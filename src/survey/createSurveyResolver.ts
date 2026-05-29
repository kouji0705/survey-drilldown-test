import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import type { SurveyDefinitionV2 } from "../types/surveyDefinition";
import { buildSurveyZodSchema } from "./buildSurveyZodSchema";
import { getVisibleFieldIds } from "./evaluateVisibility";

/**
 * 送信時にその時点のフォーム値から visible を再計算し、
 * 動的に Zod スキーマを組み立てて検証する。
 */
export function createSurveyResolver(
  definition: SurveyDefinitionV2,
): Resolver<Record<string, unknown>> {
  return async (values, context, options) => {
    const visibleIds = getVisibleFieldIds(definition, values);
    const schema = buildSurveyZodSchema(definition, visibleIds, values);
    return zodResolver(schema)(values, context, options);
  };
}
