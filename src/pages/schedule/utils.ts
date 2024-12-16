// src/pages/schedule/utils.ts
import { startOfMonth, endOfMonth, eachDayOfInterval, format as formatDate } from 'date-fns';

export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const isSameDayAsDate = (d1: Date, d2: Date): boolean => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

export const dateToFormat = (dateStr: string, formatStr: string): string => {
  const date = new Date(dateStr);
  return formatDate(date, formatStr);
};
