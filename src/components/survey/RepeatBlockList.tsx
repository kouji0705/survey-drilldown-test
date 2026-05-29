import type { FieldArrayWithId } from "react-hook-form";
import type { SurveyDefinition } from "../../types/api";
import type { SurveyInputs } from "../../types/survey";
import { RepeatBlockSet } from "./RepeatBlockSet";

type RepeatFields = SurveyDefinition["questions"]["q2_repeat_block"]["fields"];

type Props = {
  namePrefix: "q2_repeat_items";
  fields: FieldArrayWithId<SurveyInputs, "q2_repeat_items", "id">[];
  total: number;
  repeatFields: RepeatFields;
};

export const RepeatBlockList = ({ namePrefix, fields, total, repeatFields }: Props) => {
  return (
    <div style={{ display: "flex" , flexDirection: "column", gap: "20px" }}>
      {fields.map((field, index) => (
        <RepeatBlockSet
          key={field.id}
          index={index}
          total={total}
          namePrefix={namePrefix}
          fields={repeatFields}
        />
      ))}
    </div>
  );
};
