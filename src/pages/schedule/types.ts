import { Database, Tables } from '@/type/database.types';

export type ExamTypeEnum = Database['public']['Enums']['exam_type_enum'];

export interface ScheduleBar {
  id: string;
  type: 'application' | 'exam';
  start: { row: number; col: number };
  end: { row: number; col: number };
  color: string;
  text: string;
  examType: string;
  round: number;
  verticalPosition: number;
}

export interface ExamCalendarProps {
  schedules: Tables<'exam_schedules'>[];
}

