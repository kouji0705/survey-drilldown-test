import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
};

export const CheckboxGroupField = ({ name, label, options, required }: Props) => {
  const { register } = useFormContext();
  return (
    <div style={{ padding: "16px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #ced4da" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px" }}>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.map((opt) => (
          <label key={opt.value} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="checkbox"
              value={opt.value}
              {...register(name, { required: required ? "1つ以上選択してください" : false })}
            />
            {opt.label}
          </label>
        ))}
      </div>
      <ErrorMessage name={name} />
    </div>
  );
};
