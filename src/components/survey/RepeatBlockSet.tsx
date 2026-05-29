import type { SurveyDefinition } from "../../types/api";
import { InputField, SelectField } from "../fields";

type RepeatFields = SurveyDefinition["questions"]["q2_repeat_block"]["fields"];

type Props = {
  index: number;
  total: number;
  namePrefix: string;
  fields: RepeatFields;
};

export const RepeatBlockSet = ({ index, total, namePrefix, fields }: Props) => {
  const base = `${namePrefix}.${index}`;
  return (
    <div
      style={{
        padding: "16px",
        background: "#fff",
        borderRadius: "8px",
        border: "2px solid #6f42c1",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ fontWeight: "bold", color: "#6f42c1", fontSize: "14px" }}>
        セット {index + 1} / {total}
      </div>
      <InputField
        name={`${base}.field_a`}
        label={fields.field_a.label}
        required
        placeholder={fields.field_a.placeholder}
      />
      <InputField
        name={`${base}.field_b`}
        label={fields.field_b.label}
        required
        placeholder={fields.field_b.placeholder}
      />
      <SelectField
        name={`${base}.field_c`}
        label={fields.field_c.label}
        required
        options={fields.field_c.options}
      />
    </div>
  );
};
