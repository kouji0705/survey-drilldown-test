import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage";

type Props = {
  name: string;
  label: string;
  min?: number;
  max?: number;
  placeholder?: string;
};

/** 数値入力。`valueAsNumber: true` で number としてフォームに格納。 */
export const NumberField = ({ name, label, min = 1, max, placeholder }: Props) => {
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
        {...register(name, { valueAsNumber: true })}
        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <ErrorMessage name={name} />
    </div>
  );
};
