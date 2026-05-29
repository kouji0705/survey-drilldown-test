import type { RepeatTemplateField } from "../../types/surveyDefinition";
import { RepeatBlockSet } from "./RepeatBlockSet";

type Props = {
  namePrefix: string;
  fields: { id: string }[];
  total: number;
  template: RepeatTemplateField[];
};

export const RepeatBlockList = ({ namePrefix, fields, total, template }: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {fields.map((field, index) => (
        <RepeatBlockSet
          key={field.id}
          index={index}
          total={total}
          namePrefix={namePrefix}
          template={template}
        />
      ))}
    </div>
  );
};
