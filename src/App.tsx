import { useForm, FormProvider, useFormContext, type SubmitHandler } from "react-hook-form";

// --- 型定義 ---
type SurveyInputs = {
  q1_main: "" | "A" | "B" | "C" | "D";
  q2_options?: string[];       // チェックボックス (A, Dで表示)
  q2_sub_reason?: string;      // 深掘り: Q2で「その他」選択時のみ表示
  q3_category?: string;        // プルダウン (Aのみ表示)
  q4_freetext?: string;        // テキスト (B, Dで表示)
};

// --- 1. Atoms: 汎用的な入力コンポーネント ---

const ErrorMessage = ({ name }: { name: string }) => {
  const { formState: { errors } } = useFormContext();
  const error = errors[name];
  if (!error) return null;
  return <span style={{ color: "#dc3545", fontSize: "13px", display: "block", marginTop: "6px", fontWeight: "bold" }}>{error.message as string}</span>;
};

// ラジオボタン
const RadioGroupField = ({ name, label, options, required }: any) => {
  const { register } = useFormContext();
  return (
    <div style={{ padding: "16px", background: "#fff", borderRadius: "8px", border: "1px solid #ddd" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px" }}>{label}</label>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {options.map((opt: any) => (
          <label key={opt.value} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
            <input type="radio" value={opt.value} {...register(name, { required: required ? "必須項目です" : false })} />
            {opt.label}
          </label>
        ))}
      </div>
      <ErrorMessage name={name} />
    </div>
  );
};

// チェックボックス（複数選択）
const CheckboxGroupField = ({ name, label, options, required }: any) => {
  const { register } = useFormContext();
  return (
    <div style={{ padding: "16px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #ced4da" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px" }}>{label}</label>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {options.map((opt: any) => (
          <label key={opt.value} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
            <input type="checkbox" value={opt.value} {...register(name, { required: required ? "1つ以上選択してください" : false })} />
            {opt.label}
          </label>
        ))}
      </div>
      <ErrorMessage name={name} />
    </div>
  );
};

// プルダウン
const SelectField = ({ name, label, options, required }: any) => {
  const { register } = useFormContext();
  return (
    <div style={{ padding: "16px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #ced4da" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px" }}>{label}</label>
      <select {...register(name, { required: required ? "必須項目です" : false })} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}>
        <option value="">選択してください</option>
        {options.map((opt: any) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <ErrorMessage name={name} />
    </div>
  );
};

// テキスト入力
const InputField = ({ name, label, required, placeholder }: any) => {
  const { register } = useFormContext();
  return (
    <div style={{ padding: "16px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #ced4da" }}>
      <label style={{ display: "block", fontWeight: "bold", marginBottom: "12px" }}>{label}</label>
      <input type="text" placeholder={placeholder} {...register(name, { required: required ? "必須項目です" : false })} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} />
      <ErrorMessage name={name} />
    </div>
  );
};

// --- 2. Organism: アンケートの分岐ロジック本体 ---

export default function App() {
  const methods = useForm<SurveyInputs>({
    shouldUnregister: true, // コンポーネントがDOMから消えたら値を破棄
  });

  // ロジック判定用に特定のフィールドの変更を監視
  const q1Value = methods.watch("q1_main");
  const q2Values = methods.watch("q2_options") || [];

  // 表示条件の定義（ここで「どの条件で何を見せるか」を集中管理）
  const showQ2 = q1Value === "A" || q1Value === "D";
  const showQ3 = q1Value === "A";
  const showQ4 = q1Value === "B" || q1Value === "D";
  
  // 深層ドリルダウン: Q2が表示されており、かつ「other（その他）」が含まれているか
  const showQ2Sub = showQ2 && q2Values.includes("other");

  const onSubmit: SubmitHandler<SurveyInputs> = (data) => {
    console.log("送信ペイロード:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ borderBottom: "3px solid #333", paddingBottom: "10px", marginBottom: "24px" }}>
        複雑な分岐・深層ドリルダウン検証
      </h2>
      
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Q1: ルートとなる設問（ラジオボタン） */}
          <RadioGroupField
            name="q1_main"
            label="問1. 該当するものを選択してください [必須]"
            required={true}
            options={[
              { value: "A", label: "A (問2, 問3へ)" },
              { value: "B", label: "B (問4へ)" },
              { value: "C", label: "C (追加設問なし)" },
              { value: "D", label: "D (問2, 問4へ)" },
            ]}
          />

          {/* Q2: A or D の場合に出現するチェックボックス */}
          {showQ2 && (
            <div style={{ borderLeft: "4px solid #007bff", paddingLeft: "16px" }}>
              <CheckboxGroupField
                name="q2_options"
                label="問2. 関連する項目をすべて選んでください [必須]"
                required={true}
                options={[
                  { value: "item1", label: "項目 1" },
                  { value: "item2", label: "項目 2" },
                  { value: "other", label: "その他（詳細入力へ）" }, // これを選ぶとさらに深掘り
                ]}
              />
            </div>
          )}

          {/* Q2-1 (深掘り): Q2で「その他」が選ばれた場合のみ出現するテキスト */}
          {showQ2Sub && (
            <div style={{ borderLeft: "4px solid #007bff", marginLeft: "24px", paddingLeft: "16px" }}>
              <InputField
                name="q2_sub_reason"
                label="問2-1. 「その他」の詳細を記入してください [必須]"
                required={true}
                placeholder="例: 独自の要件があるため"
              />
            </div>
          )}

          {/* Q3: A の場合のみ出現するプルダウン */}
          {showQ3 && (
            <div style={{ borderLeft: "4px solid #28a745", paddingLeft: "16px" }}>
              <SelectField
                name="q3_category"
                label="問3. カテゴリを選択してください [必須]"
                required={true}
                options={[
                  { value: "cat1", label: "カテゴリ 1" },
                  { value: "cat2", label: "カテゴリ 2" },
                ]}
              />
            </div>
          )}

          {/* Q4: B or D の場合に出現するテキスト入力 */}
          {showQ4 && (
            <div style={{ borderLeft: "4px solid #ffc107", paddingLeft: "16px" }}>
              <InputField
                name="q4_freetext"
                label="問4. 自由記述欄 [必須]"
                required={true}
                placeholder="特記事項を入力してください"
              />
            </div>
          )}

          <div style={{ marginTop: "16px" }}>
            <button 
              type="submit" 
              style={{ width: "100%", padding: "16px", background: "#000", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold", transition: "0.2s" }}
            >
              ペイロードを生成して検証
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}