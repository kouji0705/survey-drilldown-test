import { useMemo, useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { submitSurveyResponse } from "../../api/survey";
import { ApiError } from "../../api/client";
import type { SurveyDefinitionV2, SurveyFieldRepeat } from "../../types/surveyDefinition";
import { getVisibleFieldIds } from "../../survey/evaluateVisibility";
import { createSurveyResolver } from "../../survey/createSurveyResolver";
import { SurveyFieldRenderer } from "./SurveyFieldRenderer";
import { RepeatFieldSection } from "./RepeatFieldSection";

type Props = {
  surveyId: string;
  definition: SurveyDefinitionV2;
};

export const SurveyForm = ({ surveyId, definition }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resolver = useMemo(() => createSurveyResolver(definition), [definition]);

  const methods = useForm<Record<string, unknown>>({
    shouldUnregister: true,
    resolver,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const values = methods.watch();
  const visibleIds = getVisibleFieldIds(definition, values);

  const onSubmit: SubmitHandler<Record<string, unknown>> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const result = await submitSurveyResponse(surveyId, data);
      console.log("送信成功:", result);
      alert(
        `送信完了\nresponseId: ${result.responseId}\nreceivedAt: ${result.receivedAt}`,
      );
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "送信に失敗しました";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        {definition.fields.map((field) => {
          const isVisible = visibleIds.has(field.id);
          if (!isVisible) return null;

          if (field.type === "repeat") {
            return (
              <RepeatFieldSection
                key={field.id}
                field={field as SurveyFieldRepeat}
                definition={definition}
                isVisible={isVisible}
              />
            );
          }

          return (
            <SurveyFieldRenderer
              key={field.id}
              field={field}
              definition={definition}
            />
          );
        })}

        {submitError && (
          <p style={{ color: "#dc3545", fontWeight: "bold", margin: 0 }}>{submitError}</p>
        )}

        <div style={{ marginTop: "16px" }}>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "100%",
              padding: "16px",
              background: isSubmitting ? "#666" : "#000",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "0.2s",
            }}
          >
            {isSubmitting ? "送信中..." : (definition.options.submitButtonLabel ?? "送信")}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
