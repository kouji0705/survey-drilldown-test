import { InputField, SelectField } from "../fields";

type Props = {
  index: number;
  total: number;
  namePrefix: string;
};

export const RepeatBlockSet = ({ index, total, namePrefix }: Props) => {
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
        label="項目A [必須]"
        required
        placeholder="項目Aを入力"
      />
      <InputField
        name={`${base}.field_b`}
        label="項目B [必須]"
        required
        placeholder="項目Bを入力"
      />
      <SelectField
        name={`${base}.field_c`}
        label="項目C [必須]"
        required
        options={[
          { value: "opt1", label: "選択肢 1" },
          { value: "opt2", label: "選択肢 2" },
        ]}
      />
    </div>
  );
};
