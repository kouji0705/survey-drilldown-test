import { http, HttpResponse, delay } from "msw";
import { mockSurveyDefinition } from "./data/surveyDefinition";
import type { SubmitSurveyResponse } from "../types/api";

const surveys = new Map([[mockSurveyDefinition.id, mockSurveyDefinition]]);

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
