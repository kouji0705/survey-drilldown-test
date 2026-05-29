import type { SurveyDefinition, SurveyField } from "@domain/survey";
import {
  RadioGroupField,
  CheckboxGroupField,
  SelectField,
  InputField,
  NumberField,
} from "@shared/ui/form";

type Props = {
  /** 単一設問の定義（`repeat` 以外） */
  field: SurveyField;
  definition: SurveyDefinition;
};

/**
 * 設問 `type` に応じて Shared 層のフィールドコンポーネントを出し分ける。
 *
 * バリデーションは Zod に委譲し、`register(name)` のみ行う。
 */
export const SurveyFieldRenderer = ({ field, definition }: Props) => {
  switch (field.type) {
    case "radio":
      return (
        <RadioGroupField
          name={field.name}
          label={field.label}
          options={field.choices}
        />
      );
    case "checkbox":
      return (
        <CheckboxGroupField
          name={field.name}
          label={field.label}
          options={field.choices}
        />
      );
    case "text":
      return (
        <InputField
          name={field.name}
          label={field.label}
          placeholder={field.placeholder}
        />
      );
    case "number": {
      const repeatEntry = Object.entries(definition.options.repeat).find(
        ([, opt]) => opt.countFrom === field.id,
      );
      const maxCount = repeatEntry?.[1].maxCount;
      const label =
        maxCount !== undefined && field.min !== undefined
          ? `${field.label}（${field.min}〜${maxCount}）`
          : field.label;
      return (
        <NumberField
          name={field.name}
          label={label}
          min={field.min}
          max={maxCount}
          placeholder={field.placeholder}
        />
      );
    }
    case "select":
      return (
        <SelectField
          name={field.name}
          label={field.label}
          options={field.choices}
        />
      );
    case "repeat":
      return null;
  }
};
