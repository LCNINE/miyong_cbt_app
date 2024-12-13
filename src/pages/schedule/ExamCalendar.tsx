import React, { useState } from 'react';
import { addMonths, setMonth } from 'date-fns';
import { ExamCalendarProps, ScheduleBar, ExamTypeEnum } from './types';
import { getMonthDays, getGridPosition, isOverlapping } from './utils';
import { CalendarHeader } from './CalendarHeader';
import { ScheduleBars } from './ScheduleBars';
import { CalendarGrid } from './CalendarGrid';

const ExamCalendar: React.FC<ExamCalendarProps> = ({ schedules }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const { days, startOffset, monthStart, monthEnd } = getMonthDays(currentDate);

  const handlePrevMonth = () => setCurrentDate(prev => addMonths(prev, -1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(prev => setMonth(prev, parseInt(event.target.value)));
  };

  const calculateScheduleBars = () => {
    const bars: ScheduleBar[] = [];

    schedules.forEach(schedule => {
      const applicationStart = new Date(schedule.application_starts_at);
      const applicationEnd = new Date(schedule.application_ends_at);
      const examStart = new Date(schedule.starts_at);
      const examEnd = new Date(schedule.ends_at);

      const isDateInRange = (date: Date) => date >= monthStart && date <= monthEnd;
      const isDateRangeVisible = (startDate: Date, endDate: Date) => (
        isDateInRange(startDate) || isDateInRange(endDate) || (startDate <= monthStart && endDate >= monthEnd)
      );

      const type = schedule.exam_type === "필기" as ExamTypeEnum ? "written" : "practical";
      const colors = {
        written: { application: "bg-blue-200/70", exam: "bg-blue-500/70" },
        practical: { application: "bg-green-200/70", exam: "bg-green-500/70" },
      };

      if (isDateRangeVisible(applicationStart, applicationEnd)) {
        const visibleStart = isDateInRange(applicationStart) ? applicationStart : monthStart;
        const visibleEnd = isDateInRange(applicationEnd) ? applicationEnd : monthEnd;
        const startPos = getGridPosition(visibleStart, monthStart, startOffset);
        const endPos = getGridPosition(visibleEnd, monthStart, startOffset);

        if (startPos && endPos) {
          bars.push({
            id: `${schedule.id}-application`,
            type: 'application',
            start: startPos,
            end: endPos,
            color: colors[type].application,
            text: `${schedule.exam_type} ${schedule.exam_round}회차 접수`,
            examType: schedule.exam_type,
            round: schedule.exam_round,
            verticalPosition: 0
          });
        }
      }

      if (isDateRangeVisible(examStart, examEnd)) {
        const visibleStart = isDateInRange(examStart) ? examStart : monthStart;
        const visibleEnd = isDateInRange(examEnd) ? examEnd : monthEnd;
        const startPos = getGridPosition(visibleStart, monthStart, startOffset);
        const endPos = getGridPosition(visibleEnd, monthStart, startOffset);

        if (startPos && endPos) {
          bars.push({
            id: `${schedule.id}-exam`,
            type: 'exam',
            start: startPos,
            end: endPos,
            color: colors[type].exam,
            text: `${schedule.exam_type} ${schedule.exam_round}회차 시험`,
            examType: schedule.exam_type,
            round: schedule.exam_round,
            verticalPosition: 0
          });
        }
      }
    });

    bars.sort((a, b) => {
      if (a.start.row !== b.start.row) return a.start.row - b.start.row;
      if (a.start.col !== b.start.col) return a.start.col - b.start.col;
      const aLength = (a.end.row - a.start.row) * 7 + (a.end.col - a.start.col);
      const bLength = (b.end.row - b.start.row) * 7 + (b.end.col - b.start.col);
      return bLength - aLength;
    });

    const processedBars = [...bars];
    const rowHeights: number[][] = Array(6).fill(null).map(() => Array(7).fill(0));

    processedBars.forEach((bar) => {
      let verticalPosition = 0;
      let foundPosition = false;

      while (!foundPosition) {
        foundPosition = true;
        for (let i = 0; i < processedBars.indexOf(bar); i++) {
          const prevBar = processedBars[i];
          if (isOverlapping(bar, prevBar) && prevBar.verticalPosition === verticalPosition) {
            foundPosition = false;
            verticalPosition++;
            break;
          }
        }
      }

      bar.verticalPosition = verticalPosition;

      for (let row = bar.start.row; row <= bar.end.row; row++) {
        for (let col = (row === bar.start.row ? bar.start.col : 0); 
             col <= (row === bar.end.row ? bar.end.col : 6); 
             col++) {
          rowHeights[row][col] = Math.max(rowHeights[row][col], verticalPosition + 1);
        }
      }
    });

    return processedBars;
  };

  const scheduleBars = calculateScheduleBars();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <CalendarHeader
        currentDate={currentDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onMonthChange={handleMonthChange}
      />
      
      <div className="relative">
        <div className="grid grid-cols-7 gap-px bg-gray-200 absolute inset-0">
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <div key={day} className="bg-white p-2 text-center font-medium">
              {day}
            </div>
          ))}
          
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-white p-2 min-h-24" />
          ))}

          {days.map(day => (
            <div key={day.toISOString()} className="bg-white p-2 min-h-24" />
          ))}
        </div>

        <ScheduleBars scheduleBars={scheduleBars} />

        <CalendarGrid days={days} startOffset={startOffset} />
      </div>
      
      <div className="mt-4 flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-200 rounded"></div>
          <span>필기 접수</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>필기 시험</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <span>실기 접수</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>실기 시험</span>
        </div>
      </div>
    </div>
  );
};

export default ExamCalendar;

