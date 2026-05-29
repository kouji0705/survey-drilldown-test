import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { SurveyDefinitionV2, SurveyFieldRepeat } from "../../types/surveyDefinition";
import { emptyRepeatItemFromTemplate, parseRepeatCount } from "../../survey/repeatUtils";
import { RepeatBlockList } from "./RepeatBlockList";

type Props = {
  field: SurveyFieldRepeat;
  definition: SurveyDefinitionV2;
  isVisible: boolean;
};

export const RepeatFieldSection = ({ field, definition, isVisible }: Props) => {
  const { control, watch, getValues } = useFormContext<Record<string, unknown>>();
  const repeatOpt = definition.options.repeat[field.id];
  const countRaw = watch(repeatOpt.countFrom);
  const repeatCount = isVisible ? parseRepeatCount(countRaw, repeatOpt.maxCount) : 0;

  const { fields, replace } = useFieldArray({
    control,
    // 動的な name（JSON 定義由来）
    name: field.name as never,
  });

  useEffect(() => {
    if (!isVisible || repeatCount === 0) {
      if (fields.length > 0) replace([]);
      return;
    }

    const current = (getValues(field.name) as Record<string, string>[] | undefined) ?? [];
    if (current.length === repeatCount) return;

    if (current.length > repeatCount) {
      replace(current.slice(0, repeatCount));
    } else {
      replace([
        ...current,
        ...Array.from({ length: repeatCount - current.length }, () =>
          emptyRepeatItemFromTemplate(field.template),
        ),
      ]);
    }
  }, [isVisible, repeatCount, replace, getValues, field.name, field.template, fields.length]);

  if (!isVisible || repeatCount === 0) return null;

  return (
    <div style={{ borderLeft: "4px solid #6f42c1", marginLeft: "48px", paddingLeft: "16px" }}>
      <p style={{ fontWeight: "bold", marginBottom: "16px", color: "#6f42c1" }}>{field.label}</p>
      <RepeatBlockList
        namePrefix={field.name}
        fields={fields}
        total={repeatCount}
        template={field.template}
      />
    </div>
  );
};
