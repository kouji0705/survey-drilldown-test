/**
 * アンケートドメインの公開 API。
 *
 * - **model** … 型定義（{@link SurveyDefinition} など）
 * - **services** … 分岐・繰り返し・バリデーション（フレームワーク非依存）
 *
 * @packageDocumentation
 */

export type {
  SurveyDefinition,
  SurveyDefinitionV2,
  SurveyField,
  SurveyFieldRepeat,
  RepeatTemplateField,
  FieldChoice,
} from "./model/definition";

export { getVisibleFieldIds, isFieldRequired } from "./services/visibility";
export { parseRepeatCount, emptyRepeatItemFromTemplate } from "./services/repeat";
export { buildSurveyZodSchema } from "./services/validation/buildSchema";
export { createSurveyResolver } from "./services/validation/createResolver";
