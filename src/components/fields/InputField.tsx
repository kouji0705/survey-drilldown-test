import { useFormContext } from "react-hook-form";
import { ErrorMessage } from "./ErrorMessage";

type Props = {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
};

export const InputField = ({ name, label, required, placeholder }: Props) => {
  const { register } = useFormContext();
  return (
    <div style={{ padding: "16px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #ced4da" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px" }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        {...register(name, { required: required ? "必須項目です" : false })}
        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
      />
      <ErrorMessage name={name} />
    </div>
  );
};
