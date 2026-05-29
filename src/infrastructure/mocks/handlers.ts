import { http, HttpResponse, delay } from "msw";
import type { SubmitSurveyResponse } from "@infrastructure/api";
import { surveyFixture } from "./fixtures/survey.fixture";

/** surveyId → 定義のインメモリストア（モック用） */
const surveys = new Map([[surveyFixture.id, surveyFixture]]);

/**
 * アンケート API の MSW ハンドラ一覧。
 *
 * - GET `/api/surveys/:surveyId` … 定義取得（400ms delay）
 * - POST `/api/surveys/:surveyId/responses` … 回答送信（600ms delay）
 */
export const handlers = [
  http.get("/api/surveys/:surveyId", async ({ params }) => {
    await delay(400);

    const surveyId = params.surveyId as string;
    const survey = surveys.get(surveyId);

    if (!survey) {
      return HttpResponse.json(
        { message: `アンケート ${surveyId} は見つかりません` },
        { status: 404 },
      );
    }

    return HttpResponse.json(survey);
  }),

  http.post("/api/surveys/:surveyId/responses", async ({ params, request }) => {
    await delay(600);

    const surveyId = params.surveyId as string;
    if (!surveys.has(surveyId)) {
      return HttpResponse.json(
        { message: `アンケート ${surveyId} は見つかりません` },
        { status: 404 },
      );
    }

    const payload = await request.json();
    const response: SubmitSurveyResponse = {
      responseId: `res-${crypto.randomUUID().slice(0, 8)}`,
      surveyId,
      receivedAt: new Date().toISOString(),
      payload,
    };

    return HttpResponse.json(response, { status: 201 });
  }),
];
