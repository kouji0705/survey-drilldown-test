export type FieldOption = {
  value: string;
  label: string;
};

export type SurveyDefinition = {
  id: string;
  title: string;
  maxRepeatCount: number;
  questions: {
    q1_main: {
      label: string;
      required: boolean;
      options: FieldOption[];
    };
    q2_options: {
      label: string;
      required: boolean;
      options: FieldOption[];
      drilldownValue: string;
    };
    q2_sub_reason: {
      label: string;
      required: boolean;
      placeholder: string;
    };
    q2_repeat_count: {
      label: string;
      required: boolean;
      placeholder: string;
      min: number;
    };
    q2_repeat_block: {
      title: string;
      fields: {
        field_a: { label: string; placeholder: string };
        field_b: { label: string; placeholder: string };
        field_c: { label: string; options: FieldOption[] };
      };
    };
    q3_category: {
      label: string;
      required: boolean;
      options: FieldOption[];
    };
    q4_freetext: {
      label: string;
      required: boolean;
      placeholder: string;
    };
  };
  submitButtonLabel: string;
};

export type SubmitSurveyResponse = {
  responseId: string;
  surveyId: string;
  receivedAt: string;
  payload: unknown;
};

export type ApiErrorBody = {
  message: string;
};
