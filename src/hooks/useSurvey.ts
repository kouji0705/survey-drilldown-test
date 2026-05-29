import { useCallback, useEffect, useState } from "react";
import { fetchSurveyDefinition } from "../api/survey";
import type { SurveyDefinition } from "../types/api";
import { ApiError } from "../api/client";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: SurveyDefinition };

export function useSurvey(surveyId: string) {
  const [state, setState] = useState<State>({ status: "loading" });

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
