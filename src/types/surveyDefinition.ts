/** 選択肢（radio / checkbox / select 共通） */
export type FieldChoice = {
  value: string;
  label: string;
};

export type FieldType = "radio" | "checkbox" | "text" | "number" | "select" | "repeat";

export type SurveyFieldBase = {
  id: string;
  name: string;
  type: FieldType;
  label: string;
};

export type SurveyFieldRadio = SurveyFieldBase & {
  type: "radio";
  choices: FieldChoice[];
};

export type SurveyFieldCheckbox = SurveyFieldBase & {
  type: "checkbox";
  choices: FieldChoice[];
};

export type SurveyFieldText = SurveyFieldBase & {
  type: "text";
  placeholder?: string;
};

export type SurveyFieldNumber = SurveyFieldBase & {
  type: "number";
  placeholder?: string;
  min?: number;
};

export type SurveyFieldSelect = SurveyFieldBase & {
  type: "select";
  choices: FieldChoice[];
};

export type RepeatTemplateField = {
  name: string;
  type: "text" | "select";
  label: string;
  placeholder?: string;
  choices?: FieldChoice[];
};

export type SurveyFieldRepeat = SurveyFieldBase & {
  type: "repeat";
  template: RepeatTemplateField[];
};

export type SurveyField =
  | SurveyFieldRadio
  | SurveyFieldCheckbox
  | SurveyFieldText
  | SurveyFieldNumber
  | SurveyFieldSelect
  | SurveyFieldRepeat;

/** マッチ条件（トリガー設問の値に対する） */
export type DrilldownMatch =
  | string
  | { in: string[] }
  | { includes: string }
  | { gte: number };

export type DrilldownRule = {
  match: DrilldownMatch;
  show: string[];
};

/** 設問ごとの必須・表示のデフォルト（表示中のときに適用） */
export type FieldRule = {
  /** 常に表示 / ドリルダウンで出るまで非表示 */
  visibility: "always" | "hidden";
  /** 表示中のとき必須か任意か */
  required: "required" | "optional";
};

export type RepeatOption = {
  countFrom: string;
  maxCount: number;
};

export type SurveyOptions = {
  drilldown: Record<string, DrilldownRule[]>;
  rules: Record<string, FieldRule>;
  repeat: Record<string, RepeatOption>;
  submitButtonLabel?: string;
};

export type SurveyDefinitionV2 = {
  id: string;
  title: string;
  fields: SurveyField[];
  options: SurveyOptions;
};
