import { useCallback, useEffect, useState } from "react";
import { ApiError, fetchSurveyDefinition, type SurveyDefinition } from "@infrastructure/api";

/** {@link useSurvey} の判別可能ユニオン状態 */
type SurveyLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: SurveyDefinition };

/**
 * アンケート定義の取得と loading / error 状態を管理する Hook。
 *
 * マウント時に自動 fetch し、`refetch` で再取得できる。
 *
 * @param surveyId - 取得対象のアンケート ID
 * @returns 状態と `refetch` 関数のスプレッド
 *
 * @example
 * ```tsx
 * const survey = useSurvey("survey-001");
 * if (survey.status === "success") {
 *   return <SurveyForm definition={survey.data} />;
 * }
 * ```
 */
export function useSurvey(surveyId: string) {
  const [state, setState] = useState<SurveyLoadState>({ status: "loading" });

  const refetch = useCallback(() => {
    setState({ status: "loading" });
    fetchSurveyDefinition(surveyId)
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) => {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "アンケートの取得に失敗しました";
        setState({ status: "error", message });
      });
  }, [surveyId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
