export type SurveyInputs = {
  q1_main: "" | "A" | "B" | "C" | "D";
  q2_options?: string[];
  q2_sub_reason?: string;
  q3_category?: string;
  q4_freetext?: string;
};
