import type { DrilldownMatch, SurveyDefinitionV2 } from "../types/surveyDefinition";

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

/** JSON の drilldown + rules から、いま表示すべき field id の集合を返す */
export function getVisibleFieldIds(
  definition: SurveyDefinitionV2,
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

export function isFieldRequired(
  definition: SurveyDefinitionV2,
  fieldId: string,
  isVisible: boolean,
): boolean {
  if (!isVisible) return false;
  const rule = definition.options.rules[fieldId];
  return rule?.required === "required";
}
