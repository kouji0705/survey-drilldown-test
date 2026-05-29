import type { DrilldownMatch, SurveyDefinition } from "../model/definition";

/**
 * トリガー値がマッチ式を満たすか判定する。
 *
 * @internal
 */
function matches(value: unknown, match: DrilldownMatch): boolean {
  if (typeof match === "string") {
    return value === match;
  }
  if ("in" in match) {
    return typeof value === "string" && match.in.includes(value);
  }
  if ("includes" in match) {
    return Array.isArray(value) && value.includes(match.includes);
  }
  if ("gte" in match) {
    const n = typeof value === "number" ? value : Number(value);
    return Number.isFinite(n) && n >= match.gte;
  }
  return false;
}

/**
 * 現在のフォーム値に基づき、表示すべき field id の集合を返す。
 *
 * 1. `options.rules` で `visibility: "always"` の設問を追加
 * 2. `options.drilldown` の成立ルールの `show` を和集合で追加
 *
 * @param definition - アンケート定義
 * @param values - 現在のフォーム値（`watch()` の結果）
 * @returns 表示対象の field id
 *
 * @example
 * ```ts
 * const visible = getVisibleFieldIds(definition, { q1_main: "A" });
 * visible.has("q2_options"); // true
 * ```
 */
export function getVisibleFieldIds(
  definition: SurveyDefinition,
  values: Record<string, unknown>,
): Set<string> {
  const visible = new Set<string>();

  for (const field of definition.fields) {
    const rule = definition.options.rules[field.id];
    if (rule?.visibility === "always") {
      visible.add(field.id);
    }
  }

  for (const [triggerFieldId, rules] of Object.entries(definition.options.drilldown)) {
    const triggerValue = values[triggerFieldId];
    for (const rule of rules) {
      if (matches(triggerValue, rule.match)) {
        for (const id of rule.show) {
          visible.add(id);
        }
      }
    }
  }

  return visible;
}

/**
 * 表示中の設問が必須かどうかを返す。
 *
 * @param definition - アンケート定義
 * @param fieldId - 設問 id
 * @param isVisible - 現在表示されているか（`getVisibleFieldIds` の結果）
 * @returns 必須なら `true`
 */
export function isFieldRequired(
  definition: SurveyDefinition,
  fieldId: string,
  isVisible: boolean,
): boolean {
  if (!isVisible) return false;
  const rule = definition.options.rules[fieldId];
  return rule?.required === "required";
}
