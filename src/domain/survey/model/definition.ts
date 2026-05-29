/**
 * アンケート定義のドメインモデル。
 *
 * API / JSON から取得する設問スキーマの型。React や HTTP に依存しない。
 *
 * @packageDocumentation
 */

/** 選択肢（radio / checkbox / select 共通）。 */
export type FieldChoice = {
  /** フォーム送信値・分岐マッチに使う識別子 */
  value: string;
  /** 画面表示用ラベル */
  label: string;
};

/** 設問の入力種別。 */
export type FieldType = "radio" | "checkbox" | "text" | "number" | "select" | "repeat";

/** すべての設問タイプに共通する属性。 */
export type SurveyFieldBase = {
  /** 定義上の一意 ID（`options.drilldown` のキー・`show` の参照に使用） */
  id: string;
  /** react-hook-form のフィールド名（送信 JSON のキー） */
  name: string;
  type: FieldType;
  /** 画面に表示する設問文 */
  label: string;
};

/** 単一選択（ラジオボタン）設問。 */
export type SurveyFieldRadio = SurveyFieldBase & {
  type: "radio";
  choices: FieldChoice[];
};

/** 複数選択（チェックボックス）設問。 */
export type SurveyFieldCheckbox = SurveyFieldBase & {
  type: "checkbox";
  choices: FieldChoice[];
};

/** 1行テキスト設問。 */
export type SurveyFieldText = SurveyFieldBase & {
  type: "text";
  placeholder?: string;
};

/** 数値入力設問（繰り返し件数など）。 */
export type SurveyFieldNumber = SurveyFieldBase & {
  type: "number";
  placeholder?: string;
  /** Zod / HTML の下限。繰り返し上限は `options.repeat` 側で定義 */
  min?: number;
};

/** プルダウン設問。 */
export type SurveyFieldSelect = SurveyFieldBase & {
  type: "select";
  choices: FieldChoice[];
};

/** 繰り返しブロック内の1フィールド定義。 */
export type RepeatTemplateField = {
  name: string;
  type: "text" | "select";
  label: string;
  placeholder?: string;
  choices?: FieldChoice[];
};

/** 繰り返し入力ブロック（`useFieldArray` で配列として保持）。 */
export type SurveyFieldRepeat = SurveyFieldBase & {
  type: "repeat";
  /** 1セットあたりの子フィールド定義 */
  template: RepeatTemplateField[];
};

/** 設問定義のユニオン型。 */
export type SurveyField =
  | SurveyFieldRadio
  | SurveyFieldCheckbox
  | SurveyFieldText
  | SurveyFieldNumber
  | SurveyFieldSelect
  | SurveyFieldRepeat;

/**
 * ドリルダウン条件のマッチ式。
 *
 * - 文字列 … 完全一致（radio / select）
 * - `{ in }` … いずれかに一致
 * - `{ includes }` … 配列に値が含まれる（checkbox）
 * - `{ gte }` … 数値が以上（件数トリガー）
 */
export type DrilldownMatch =
  | string
  | { in: string[] }
  | { includes: string }
  | { gte: number };

/**
 * トリガー設問の値に対する分岐ルール。
 *
 * `options.drilldown[トリガーfieldId]` の配列要素。
 */
export type DrilldownRule = {
  match: DrilldownMatch;
  /** 条件成立時に追加表示する field の id 一覧 */
  show: string[];
};

/**
 * 設問ごとの表示・必須のデフォルト。
 *
 * 動的な出し分けは `drilldown`、表示中の必須は `required` が担当。
 */
export type FieldRule = {
  /** `always` … ルート設問 / `hidden` … 初期非表示（drilldown で出る） */
  visibility: "always" | "hidden";
  /** 表示中に適用する必須区分 */
  required: "required" | "optional";
};

/** 繰り返しブロックの制御オプション（`options.repeat`）。 */
export type RepeatOption = {
  /** 件数を読み取る field の id */
  countFrom: string;
  /** セット数の上限 */
  maxCount: number;
};

/**
 * アンケートの振る舞いオプション。
 *
 * 設問の中身（`fields`）とは分離し、分岐・必須・繰り返しをここで定義する。
 */
export type SurveyOptions = {
  /** トリガー fieldId → 分岐ルール配列 */
  drilldown: Record<string, DrilldownRule[]>;
  /** fieldId → 表示・必須のデフォルト */
  rules: Record<string, FieldRule>;
  /** repeat 型 fieldId → 件数・上限 */
  repeat: Record<string, RepeatOption>;
  submitButtonLabel?: string;
};

/**
 * アンケート定義のルート型。
 *
 * GET `/api/surveys/:id` のレスポンス Body と同型。
 */
export type SurveyDefinition = {
  id: string;
  title: string;
  /** 描画順序どおりの設問一覧（フラット） */
  fields: SurveyField[];
  options: SurveyOptions;
};

/**
 * {@link SurveyDefinition} のエイリアス。
 *
 * @deprecated {@link SurveyDefinition} を使用してください。
 */
export type SurveyDefinitionV2 = SurveyDefinition;
