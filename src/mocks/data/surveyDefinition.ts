import type { SurveyDefinition } from "../../types/api";

export const mockSurveyDefinition: SurveyDefinition = {
  id: "survey-001",
  title: "複雑な分岐・深層ドリルダウン検証",
  maxRepeatCount: 10,
  questions: {
    q1_main: {
      label: "問1. 該当するものを選択してください [必須]",
      required: true,
      options: [
        { value: "A", label: "A (問2, 問3へ)" },
        { value: "B", label: "B (問4へ)" },
        { value: "C", label: "C (追加設問なし)" },
        { value: "D", label: "D (問2, 問4へ)" },
      ],
    },
    q2_options: {
      label: "問2. 関連する項目をすべて選んでください [必須]",
      required: true,
      drilldownValue: "other",
      options: [
        { value: "item1", label: "項目 1" },
        { value: "item2", label: "項目 2" },
        { value: "other", label: "その他（詳細入力へ）" },
      ],
    },
    q2_sub_reason: {
      label: "問2-1. 「その他」の詳細を記入してください [必須]",
      required: true,
      placeholder: "例: 独自の要件があるため",
    },
    q2_repeat_count: {
      label: "問2-2. 登録する件数を入力してください [必須]",
      required: true,
      placeholder: "例: 3",
      min: 1,
    },
    q2_repeat_block: {
      title: "問2-3. 各セットの項目を入力してください",
      fields: {
        field_a: { label: "項目A [必須]", placeholder: "項目Aを入力" },
        field_b: { label: "項目B [必須]", placeholder: "項目Bを入力" },
        field_c: {
          label: "項目C [必須]",
          options: [
            { value: "opt1", label: "選択肢 1" },
            { value: "opt2", label: "選択肢 2" },
          ],
        },
      },
    },
    q3_category: {
      label: "問3. カテゴリを選択してください [必須]",
      required: true,
      options: [
        { value: "cat1", label: "カテゴリ 1" },
        { value: "cat2", label: "カテゴリ 2" },
      ],
    },
    q4_freetext: {
      label: "問4. 自由記述欄 [必須]",
      required: true,
      placeholder: "特記事項を入力してください",
    },
  },
  submitButtonLabel: "回答を送信",
};
