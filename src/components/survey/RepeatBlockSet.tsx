import type { RepeatTemplateField } from "../../types/surveyDefinition";
import { InputField, SelectField } from "../fields";

type Props = {
  index: number;
  total: number;
  namePrefix: string;
  template: RepeatTemplateField[];
};

export const RepeatBlockSet = ({ index, total, namePrefix, template }: Props) => {
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
      {template.map((item) => {
        const name = `${base}.${item.name}`;
        if (item.type === "text") {
          return (
            <InputField
              key={item.name}
              name={name}
              label={item.label}
              required
              placeholder={item.placeholder}
            />
          );
        }
        return (
          <SelectField
            key={item.name}
            name={name}
            label={item.label}
            required
            options={item.choices ?? []}
          />
        );
      })}
    </div>
  );
};
