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
  required: boolean;
  definition: SurveyDefinitionV2;
};

export const SurveyFieldRenderer = ({ field, required, definition }: Props) => {
  switch (field.type) {
    case "radio":
      return (
        <RadioGroupField
          name={field.name}
          label={field.label}
          required={required}
          options={field.choices}
        />
      );
    case "checkbox":
      return (
        <CheckboxGroupField
          name={field.name}
          label={field.label}
          required={required}
          options={field.choices}
        />
      );
    case "text":
      return (
        <InputField
          name={field.name}
          label={field.label}
          required={required}
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
          required={required}
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
          required={required}
          options={field.choices}
        />
      );
    case "repeat":
      return null;
  }
};
