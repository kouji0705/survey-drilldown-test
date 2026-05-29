import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import type { SurveyDefinition } from "../../model/definition";
import { getVisibleFieldIds } from "../visibility";
import { buildSurveyZodSchema } from "./buildSchema";

/**
 * アンケート定義に紐づく react-hook-form 用 Resolver を生成する。
 *
 * 送信のたびにフォーム値から visible を再計算し、
 * その時点の Zod スキーマで検証する（分岐・繰り返しに追従）。
 *
 * @param definition - GET で取得したアンケート定義
 * @returns `useForm({ resolver })` に渡す Resolver
 *
 * @example
 * ```ts
 * const resolver = useMemo(() => createSurveyResolver(definition), [definition]);
 * useForm({ resolver, mode: "onSubmit" });
 * ```
 */
export function createSurveyResolver(
  definition: SurveyDefinition,
): Resolver<Record<string, unknown>> {
  return async (values, context, options) => {
    const visibleIds = getVisibleFieldIds(definition, values);
    const schema = buildSurveyZodSchema(definition, visibleIds, values);
    return zodResolver(schema)(values, context, options);
  };
}
