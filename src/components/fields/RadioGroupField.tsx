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

export const RadioGroupField = ({ name, label, options, required }: Props) => {
  const { register } = useFormContext();
  return (
    <div style={{ padding: "16px", background: "#fff", borderRadius: "8px", border: "1px solid #ddd" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px" }}>{label}</label>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {options.map((opt) => (
          <label key={opt.value} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
            <input
              type="radio"
              value={opt.value}
              {...register(name, { required: required ? "必須項目です" : false })}
            />
            {opt.label}
          </label>
        ))}
      </div>
      <ErrorMessage name={name} />
    </div>
  );
};
