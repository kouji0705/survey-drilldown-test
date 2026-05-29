import type { RepeatTemplateField } from "@domain/survey";
import { RepeatBlockSet } from "./RepeatBlockSet";

type Props = {
  /** react-hook-form 上の配列名（例: `q2_repeat_items`） */
  namePrefix: string;
  /** `useFieldArray` の `fields`（各要素に安定 id あり） */
  fields: { id: string }[];
  /** 表示するセット総数 */
  total: number;
  template: RepeatTemplateField[];
};

/** 繰り返しセットの一覧コンテナ。 */
export const RepeatBlockList = ({ namePrefix, fields, total, template }: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {fields.map((field, index) => (
        <RepeatBlockSet
          key={field.id}
          index={index}
          total={total}
          namePrefix={namePrefix}
          template={template}
        />
      ))}
    </div>
  );
};
