import { useFormContext } from "react-hook-form";

type Props = {
  /** react-hook-form のフィールド名（ネスト可: `q2_repeat_items.0.field_a`） */
  name: string;
};

/**
 * react-hook-form / Zod のフィールドエラーを表示する。
 *
 * エラーがなければ何も描画しない。
 */
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
