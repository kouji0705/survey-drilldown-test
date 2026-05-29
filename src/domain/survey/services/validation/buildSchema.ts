/**
 * JSON 定義と表示中フィールドから、送信時用の Zod スキーマを動的に組み立てる。
 *
 * @packageDocumentation
 */

import { z } from "zod";
import type { SurveyDefinition, SurveyField, SurveyFieldRepeat } from "../../model/definition";
import { parseRepeatCount } from "../repeat";
import { isFieldRequired } from "../visibility";

const REQUIRED_MSG = "必須項目です";
const CHECKBOX_MSG = "1つ以上選択してください";

/** @internal */
function buildRepeatItemSchema(field: SurveyFieldRepeat) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const item of field.template) {
    if (item.type === "text") {
      shape[item.name] = z.string().min(1, REQUIRED_MSG);
    } else {
      shape[item.name] = z.string().min(1, "選択してください");
    }
  }
  return z.object(shape);
}

/** @internal */
function buildFieldSchema(
  field: SurveyField,
  definition: SurveyDefinition,
  required: boolean,
  values: Record<string, unknown>,
): z.ZodTypeAny | null {
  switch (field.type) {
    case "radio":
      return required
        ? z.string().min(1, REQUIRED_MSG)
        : z.string().optional();

    case "checkbox":
      return required
        ? z.preprocess(
            (val) => (Array.isArray(val) ? val : []),
            z.array(z.string()).min(1, CHECKBOX_MSG),
          )
        : z.preprocess(
            (val) => (Array.isArray(val) ? val : undefined),
            z.array(z.string()).optional(),
          );

    case "text":
      return required
        ? z.string().min(1, REQUIRED_MSG)
        : z.string().optional();

    case "select":
      return required
        ? z.string().min(1, REQUIRED_MSG)
        : z.string().optional();

    case "number": {
      const repeatEntry = Object.entries(definition.options.repeat).find(
        ([, opt]) => opt.countFrom === field.id,
      );
      const max = repeatEntry?.[1].maxCount;
      let schema = z.coerce
        .number({ message: REQUIRED_MSG })
        .int("整数で入力してください");
      if (field.min !== undefined) {
        schema = schema.min(field.min, `${field.min}以上で入力してください`);
      }
      if (max !== undefined) {
        schema = schema.max(max, `${max}以下で入力してください`);
      }
      if (!required) {
        return z.preprocess(
          (val) => (val === "" || val === undefined || Number.isNaN(val) ? undefined : val),
          schema.optional(),
        );
      }
      return z.preprocess(
        (val) => (val === "" || val === undefined || Number.isNaN(val) ? undefined : val),
        schema,
      );
    }

    case "repeat": {
      const repeatOpt = definition.options.repeat[field.id];
      if (!repeatOpt) return null;
      const count = parseRepeatCount(values[repeatOpt.countFrom], repeatOpt.maxCount);
      if (count === 0) return null;
      const itemSchema = buildRepeatItemSchema(field);
      return z
        .array(itemSchema)
        .length(count, `${count}件分すべて入力してください`);
    }

    default:
      return null;
  }
}

/**
 * 表示中のフィールドだけをキーに持つ Zod オブジェクトスキーマを生成する。
 *
 * @param definition - アンケート定義
 * @param visibleIds - {@link getVisibleFieldIds} の結果
 * @param values - 送信直前のフォーム値（repeat の件数算出に使用）
 * @returns `z.object(shape)` — `zodResolver` に渡すスキーマ
 *
 * @remarks
 * 非表示フィールドは shape に含めない。`shouldUnregister` と組み合わせ、
 * 送信データ・バリデーション対象を一致させる。
 */
export function buildSurveyZodSchema(
  definition: SurveyDefinition,
  visibleIds: Set<string>,
  values: Record<string, unknown>,
) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of definition.fields) {
    if (!visibleIds.has(field.id)) continue;

    const required = isFieldRequired(definition, field.id, true);
    const fieldSchema = buildFieldSchema(field, definition, required, values);
    if (fieldSchema) {
      shape[field.name] = fieldSchema;
    }
  }

  return z.object(shape);
}
