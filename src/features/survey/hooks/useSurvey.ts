import { useCallback, useEffect, useState } from "react";
import { ApiError, fetchSurveyDefinition, type SurveyDefinition } from "@infrastructure/api";

/** {@link useSurvey} の判別可能ユニオン状態 */
type SurveyLoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: SurveyDefinition };

function toErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "アンケートの取得に失敗しました";
}

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

  useEffect(() => {
    let cancelled = false;

    fetchSurveyDefinition(surveyId)
      .then((data) => {
        if (!cancelled) {
          setState({ status: "success", data });
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({ status: "error", message: toErrorMessage(err) });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [surveyId]);

  const refetch = useCallback(() => {
    setState({ status: "loading" });
    fetchSurveyDefinition(surveyId)
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) => {
        setState({ status: "error", message: toErrorMessage(err) });
      });
  }, [surveyId]);

  return { ...state, refetch };
}
