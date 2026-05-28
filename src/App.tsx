import { SurveyForm } from "./components/survey/SurveyForm";

export default function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2 style={{ borderBottom: "3px solid #333", paddingBottom: "10px", marginBottom: "24px" }}>
        複雑な分岐・深層ドリルダウン検証
      </h2>
      <SurveyForm />
    </div>
  );
}