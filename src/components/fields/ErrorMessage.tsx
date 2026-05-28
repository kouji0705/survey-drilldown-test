import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
};

export const ErrorMessage = ({ name }: Props) => {
  const { formState: { errors } } = useFormContext();
  const error = errors[name];
  if (!error) return null;
  return (
    <span style={{ color: "#dc3545", fontSize: "13px", display: "block", marginTop: "6px", fontWeight: "bold" }}>
      {error.message as string}
    </span>
  );
};
