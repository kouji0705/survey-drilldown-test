import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage";

type Props = {
  name: string;
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  placeholder?: string;
};

export const NumberField = ({ name, label, required, min = 1, max, placeholder }: Props) => {
  const { register } = useFormContext();
  return (
    <div style={{ padding: "16px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #ced4da" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px" }}>{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        step={1}
        placeholder={placeholder}
        {...register(name, {
          required: required ? "必須項目です" : false,
          valueAsNumber: true,
          min: { value: min, message: `${min}以上で入力してください` },
          max: max !== undefined ? { value: max, message: `${max}以下で入力してください` } : undefined,
          validate: (v) => {
            if (v === "" || Number.isNaN(v)) return required ? "必須項目です" : true;
            if (!Number.isInteger(v)) return "整数で入力してください";
            return true;
          },
        })}
        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <ErrorMessage name={name} />
    </div>
  );
};
