import type { SurveyDefinitionV2, SurveyField } from "../../types/surveyDefinition";
import {
  RadioGroupField,
  CheckboxGroupField,
  SelectField,
  InputField,
  NumberField,
} from "../fields";

type Props = {
  field: SurveyField;
  definition: SurveyDefinitionV2;
};

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
