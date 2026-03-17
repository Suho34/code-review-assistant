export const INTERVIEW_TYPES = ["dsa", "behavioral", "system-design"] as const;

export type InterviewType = (typeof INTERVIEW_TYPES)[number];

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  dsa: "Data Structures & Algorithms",
  behavioral: "Behavioral",
  "system-design": "System Design",
};
