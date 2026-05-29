import { useEffect, useState } from "react";
import { useForm, FormProvider, useFieldArray, type SubmitHandler } from "react-hook-form";
import { submitSurveyResponse } from "../../api/survey";
import { ApiError } from "../../api/client";
import type { SurveyDefinition } from "../../types/api";
import { type SurveyInputs } from "../../types/survey";
import {
  RadioGroupField,
  CheckboxGroupField,
  SelectField,
  InputField,
  NumberField,
} from "../fields";
import { RepeatBlockList } from "./RepeatBlockList";
import { emptyRepeatItem, parseRepeatCount } from "./repeatConstants";

type Props = {
  surveyId: string;
  definition: SurveyDefinition;
};

export const SurveyForm = ({ surveyId, definition }: Props) => {
  const { questions, maxRepeatCount } = definition;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const methods = useForm<SurveyInputs>({
    shouldUnregister: true,
  });

  const { fields, replace } = useFieldArray({
    name: "q2_repeat_items",
    control: methods.control,
  });

  const q1Value = methods.watch("q1_main");
  const q2Values = methods.watch("q2_options") || [];
  const q2RepeatCountRaw = methods.watch("q2_repeat_count");

  const showQ2 = q1Value === "A" || q1Value === "D";
  const showQ3 = q1Value === "A";
  const showQ4 = q1Value === "B" || q1Value === "D";
  const showQ2Sub = showQ2 && q2Values.includes(questions.q2_options.drilldownValue);
  const showQ2Count = showQ2Sub;
  const repeatCount = showQ2Count ? parseRepeatCount(q2RepeatCountRaw, maxRepeatCount) : 0;
  const showQ2Repeat = showQ2Count && repeatCount > 0;

  useEffect(() => {
    if (!showQ2Count || repeatCount === 0) {
      if (fields.length > 0) replace([]);
      return;
    }

    const current = methods.getValues("q2_repeat_items") ?? [];
    if (current.length === repeatCount) return;

    if (current.length > repeatCount) {
      replace(current.slice(0, repeatCount));
    } else {
      replace([
        ...current,
        ...Array.from({ length: repeatCount - current.length }, emptyRepeatItem),
      ]);
    }
  }, [showQ2Count, repeatCount, replace, methods, fields.length]);

  const onSubmit: SubmitHandler<SurveyInputs> = async (data) => {
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

  const repeatCountLabel = `${questions.q2_repeat_count.label}（${questions.q2_repeat_count.min}〜${maxRepeatCount}）`;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      >
        <RadioGroupField
          name="q1_main"
          label={questions.q1_main.label}
          required={questions.q1_main.required}
          options={questions.q1_main.options}
        />

        {showQ2 && (
          <div style={{ borderLeft: "4px solid #007bff", paddingLeft: "16px" }}>
            <CheckboxGroupField
              name="q2_options"
              label={questions.q2_options.label}
              required={questions.q2_options.required}
              options={questions.q2_options.options}
            />
          </div>
        )}

        {showQ2Sub && (
          <div style={{ borderLeft: "4px solid #007bff", marginLeft: "24px", paddingLeft: "16px" }}>
            <InputField
              name="q2_sub_reason"
              label={questions.q2_sub_reason.label}
              required={questions.q2_sub_reason.required}
              placeholder={questions.q2_sub_reason.placeholder}
            />
          </div>
        )}

        {showQ2Count && (
          <div style={{ borderLeft: "4px solid #007bff", marginLeft: "24px", paddingLeft: "16px" }}>
            <NumberField
              name="q2_repeat_count"
              label={repeatCountLabel}
              required={questions.q2_repeat_count.required}
              min={questions.q2_repeat_count.min}
              max={maxRepeatCount}
              placeholder={questions.q2_repeat_count.placeholder}
            />
          </div>
        )}

        {showQ2Repeat && (
          <div style={{ borderLeft: "4px solid #6f42c1", marginLeft: "48px", paddingLeft: "16px" }}>
            <p style={{ fontWeight: "bold", marginBottom: "16px", color: "#6f42c1" }}>
              {questions.q2_repeat_block.title}
            </p>
            <RepeatBlockList
              namePrefix="q2_repeat_items"
              fields={fields}
              total={repeatCount}
              repeatFields={questions.q2_repeat_block.fields}
            />
          </div>
        )}

        {showQ3 && (
          <div style={{ borderLeft: "4px solid #28a745", paddingLeft: "16px" }}>
            <SelectField
              name="q3_category"
              label={questions.q3_category.label}
              required={questions.q3_category.required}
              options={questions.q3_category.options}
            />
          </div>
        )}

        {showQ4 && (
          <div style={{ borderLeft: "4px solid #ffc107", paddingLeft: "16px" }}>
            <InputField
              name="q4_freetext"
              label={questions.q4_freetext.label}
              required={questions.q4_freetext.required}
              placeholder={questions.q4_freetext.placeholder}
            />
          </div>
        )}

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
            {isSubmitting ? "送信中..." : definition.submitButtonLabel}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
