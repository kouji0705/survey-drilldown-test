import { useEffect } from "react";
import { useForm, FormProvider, useFieldArray, type SubmitHandler } from "react-hook-form";
import { type SurveyInputs } from "../../types/survey";
import {
  RadioGroupField,
  CheckboxGroupField,
  SelectField,
  InputField,
  NumberField,
} from "../fields";
import { RepeatBlockList } from "./RepeatBlockList";
import { emptyRepeatItem, MAX_REPEAT, parseRepeatCount } from "./repeatConstants";

export const SurveyForm = () => {
  const methods = useForm<SurveyInputs>({
    shouldUnregister: true,
  });

  const { fields, replace } = useFieldArray({
    name: "q2_repeat_items",
    control: methods.control,
  });

  const q1Value = methods.watch("q1_main");
  const q2Values = methods.watch("q2_options") || [];
  const q2RepeatCountRaw = methods.watch("q2_repeat_count");

  const showQ2 = q1Value === "A" || q1Value === "D";
  const showQ3 = q1Value === "A";
  const showQ4 = q1Value === "B" || q1Value === "D";
  const showQ2Sub = showQ2 && q2Values.includes("other");
  const showQ2Count = showQ2Sub;
  const repeatCount = showQ2Count ? parseRepeatCount(q2RepeatCountRaw) : 0;
  const showQ2Repeat = showQ2Count && repeatCount > 0;

  useEffect(() => {
    if (!showQ2Count || repeatCount === 0) {
      if (fields.length > 0) replace([]);
      return;
    }

    const current = methods.getValues("q2_repeat_items") ?? [];
    if (current.length === repeatCount) return;

    if (current.length > repeatCount) {
      replace(current.slice(0, repeatCount));
    } else {
      replace([
        ...current,
        ...Array.from({ length: repeatCount - current.length }, emptyRepeatItem),
      ]);
    }
  }, [showQ2Count, repeatCount, replace, methods, fields.length]);

  const onSubmit: SubmitHandler<SurveyInputs> = (data) => {
    console.log("送信ペイロード:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <RadioGroupField
          name="q1_main"
          label="問1. 該当するものを選択してください [必須]"
          required
          options={[
            { value: "A", label: "A (問2, 問3へ)" },
            { value: "B", label: "B (問4へ)" },
            { value: "C", label: "C (追加設問なし)" },
            { value: "D", label: "D (問2, 問4へ)" },
          ]}
        />

        {showQ2 && (
          <div style={{ borderLeft: "4px solid #007bff", paddingLeft: "16px" }}>
            <CheckboxGroupField
              name="q2_options"
              label="問2. 関連する項目をすべて選んでください [必須]"
              required
              options={[
                { value: "item1", label: "項目 1" },
                { value: "item2", label: "項目 2" },
                { value: "other", label: "その他（詳細入力へ）" },
              ]}
            />
          </div>
        )}

        {showQ2Sub && (
          <div style={{ borderLeft: "4px solid #007bff", marginLeft: "24px", paddingLeft: "16px" }}>
            <InputField
              name="q2_sub_reason"
              label="問2-1. 「その他」の詳細を記入してください [必須]"
              required
              placeholder="例: 独自の要件があるため"
            />
          </div>
        )}

        {showQ2Count && (
          <div style={{ borderLeft: "4px solid #007bff", marginLeft: "24px", paddingLeft: "16px" }}>
            <NumberField
              name="q2_repeat_count"
              label={`問2-2. 登録する件数を入力してください [必須]（1〜${MAX_REPEAT}）`}
              required
              min={1}
              max={MAX_REPEAT}
              placeholder="例: 3"
            />
          </div>
        )}

        {showQ2Repeat && (
          <div style={{ borderLeft: "4px solid #6f42c1", marginLeft: "48px", paddingLeft: "16px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "16px", color: "#6f42c1" }}>
              問2-3. 各セットの項目を入力してください
            </p>
            <RepeatBlockList
              namePrefix="q2_repeat_items"
              fields={fields}
              total={repeatCount}
            />
          </div>
        )}

        {showQ3 && (
          <div style={{ borderLeft: "4px solid #28a745", paddingLeft: "16px" }}>
            <SelectField
              name="q3_category"
              label="問3. カテゴリを選択してください [必須]"
              required
              options={[
                { value: "cat1", label: "カテゴリ 1" },
                { value: "cat2", label: "カテゴリ 2" },
              ]}
            />
          </div>
        )}

        {showQ4 && (
          <div style={{ borderLeft: "4px solid #ffc107", paddingLeft: "16px" }}>
            <InputField
              name="q4_freetext"
              label="問4. 自由記述欄 [必須]"
              required
              placeholder="特記事項を入力してください"
            />
          </div>
        )}

        <div style={{ marginTop: "16px" }}>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "16px",
              background: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "0.2s",
            }}
          >
            ペイロードを生成して検証
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
