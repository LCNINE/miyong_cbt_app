// src/pages/schedule/types.ts
export type ExamType = "실기" | "필기";

export type ExamSchedule = {
  id: number;
  exam_type: ExamType;
  exam_round: number;
  starts_at: string;
  ends_at: string;
  application_starts_at: string;
  application_ends_at: string;
  success_announ_at: string | null;
};

export type CalendarEvent = {
  id: number;
  start: Date;
  end: Date;
  type: ExamType;
  application: boolean;
  round: number;
  slot: number; // slot = -1 initially
};
