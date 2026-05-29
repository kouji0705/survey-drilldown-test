import { SurveyForm } from "./components/survey/SurveyForm";
import { useSurvey } from "./hooks/useSurvey";

const SURVEY_ID = "survey-001";

export default function App() {
  const survey = useSurvey(SURVEY_ID);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      {survey.status === "loading" && (
        <p style={{ color: "#666" }}>アンケート定義を読み込み中...</p>
      )}

      {survey.status === "error" && (
        <div>
          <p style={{ color: "#dc3545", fontWeight: "bold" }}>{survey.message}</p>
          <button type="button" onClick={survey.refetch} style={{ marginTop: "8px" }}>
            再試行
          </button>
        </div>
      )}

      {survey.status === "success" && (
        <>
          <h2
            style={{
              borderBottom: "3px solid #333",
              paddingBottom: "10px",
              marginBottom: "24px",
            }}
          >
            {survey.data.title}
          </h2>
          <SurveyForm surveyId={SURVEY_ID} definition={survey.data} />
        </>
      )}
    </div>
  );
}
