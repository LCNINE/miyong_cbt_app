import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, differenceInDays } from 'date-fns';
import { ScheduleBar } from './types';

export const getMonthDays = (currentDate: Date) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  return {
    days: eachDayOfInterval({ start: monthStart, end: monthEnd }),
    startOffset: getDay(monthStart),
    monthStart,
    monthEnd
  };
};

export const getGridPosition = (date: Date, monthStart: Date, startOffset: number) => {
  const diffFromMonthStart = differenceInDays(date, monthStart);
  const totalDays = diffFromMonthStart + startOffset;
  return {
    row: Math.floor(totalDays / 7),
    col: totalDays % 7
  };
};

export const isOverlapping = (bar1: ScheduleBar, bar2: ScheduleBar) => {
  if (bar1.end.row < bar2.start.row || bar1.start.row > bar2.end.row) {
    return false;
  }

  for (let row = Math.max(bar1.start.row, bar2.start.row); row <= Math.min(bar1.end.row, bar2.end.row); row++) {
    const bar1StartCol = row === bar1.start.row ? bar1.start.col : 0;
    const bar1EndCol = row === bar1.end.row ? bar1.end.col : 6;
    const bar2StartCol = row === bar2.start.row ? bar2.start.col : 0;
    const bar2EndCol = row === bar2.end.row ? bar2.end.col : 6;

    if (!(bar1EndCol < bar2StartCol || bar1StartCol > bar2EndCol)) {
      return true;
    }
  }
  
  return false;
};

