export type RepeatItem = {
  field_a: string;
  field_b: string;
  field_c: "" | "opt1" | "opt2";
};

export type SurveyInputs = {
  q1_main: "" | "A" | "B" | "C" | "D";
  q2_options?: string[];
  q2_sub_reason?: string;
  q2_repeat_count?: number;
  q2_repeat_items?: RepeatItem[];
  q3_category?: string;
  q4_freetext?: string;
};
