import type { FieldArrayWithId } from "react-hook-form";
import type { SurveyInputs } from "../../types/survey";
import { RepeatBlockSet } from "./RepeatBlockSet";

type Props = {
  namePrefix: "q2_repeat_items";
  fields: FieldArrayWithId<SurveyInputs, "q2_repeat_items", "id">[];
  total: number;
};

export const RepeatBlockList = ({ namePrefix, fields, total }: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {fields.map((field, index) => (
        <RepeatBlockSet key={field.id} index={index} total={total} namePrefix={namePrefix} />
      ))}
    </div>
  );
};
