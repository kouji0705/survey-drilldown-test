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
};

/** プルダウン（select）設問。 */
export const SelectField = ({ name, label, options }: Props) => {
  const { register } = useFormContext();
  return (
    <div style={{ padding: "16px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #ced4da" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px" }}>{label}</label>
      <select
        {...register(name)}
        style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
      >
        <option value="">選択してください</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ErrorMessage name={name} />
    </div>
  );
};
