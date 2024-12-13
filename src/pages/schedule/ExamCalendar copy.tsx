import React, { useState } from 'react';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, getDay, isWithinInterval, addMonths, setMonth, isSameDay, isEqual } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Database, Tables } from '@/type/database.types';

type ExamTypeEnum = Database['public']['Enums']['exam_type_enum'];

interface ScheduleBar {
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

const ExamCalendar = ({ schedules }: { schedules: Tables<'exam_schedules'>[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startOffset = getDay(monthStart);

  const handlePrevMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentDate(prev => setMonth(prev, parseInt(event.target.value)));
  };

  // 특정 날짜의 그리드 위치를 계산하는 함수
  const getGridPosition = (date: Date) => {
    const dayOfMonth = parseInt(format(date, 'd')) - 1;
    const position = startOffset + dayOfMonth;
    const row = Math.floor(position / 7);
    const col = position % 7;
    return { row, col };
  };

  // 막대들이 겹치는지 확인하는 함수 - 더 정확한 겹침 체크
  const isOverlapping = (bar1: ScheduleBar, bar2: ScheduleBar) => {
    // 서로 다른 행에 완전히 분리되어 있는 경우
    if (bar1.end.row < bar2.start.row || bar1.start.row > bar2.end.row) {
      return false;
    }

    // 같은 행이 있는 경우, 열(column) 겹침 확인
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

  // 모든 일정 막대 정보를 계산하고 겹침을 처리하는 함수
  const calculateScheduleBars = () => {
    const bars: ScheduleBar[] = [];

    schedules.forEach(schedule => {
      const applicationStart = new Date(schedule.application_starts_at);
      const applicationEnd = new Date(schedule.application_ends_at);
      const examStart = new Date(schedule.starts_at);
      const examEnd = new Date(schedule.ends_at);

      const isCurrentMonth = (date: Date) => 
        date.getMonth() === currentDate.getMonth() && 
        date.getFullYear() === currentDate.getFullYear();

      const shouldShowApplication = 
        isCurrentMonth(applicationStart) || 
        isCurrentMonth(applicationEnd) ||
        (applicationStart < monthStart && applicationEnd > monthEnd);

      const shouldShowExam = 
        isCurrentMonth(examStart) || 
        isCurrentMonth(examEnd) ||
        (examStart < monthStart && examEnd > monthEnd);

      if (!shouldShowApplication && !shouldShowExam) return;

      const type = schedule.exam_type === "필기" as ExamTypeEnum ? "written" : "practical";
      const colors = {
        written: {
          application: "bg-blue-200/70",
          exam: "bg-blue-500/70",
        },
        practical: {
          application: "bg-green-200/70",
          exam: "bg-green-500/70",
        },
      };

      if (shouldShowApplication) {
        const startPos = getGridPosition(
          applicationStart < monthStart ? monthStart : applicationStart
        );
        const endPos = getGridPosition(
          applicationEnd > monthEnd ? monthEnd : applicationEnd
        );

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

      if (shouldShowExam) {
        const startPos = getGridPosition(
          examStart < monthStart ? monthStart : examStart
        );
        const endPos = getGridPosition(
          examEnd > monthEnd ? monthEnd : examEnd
        );

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
    });

    // 시작 날짜와 시간을 기준으로 정렬
    bars.sort((a, b) => {
      if (a.start.row !== b.start.row) return a.start.row - b.start.row;
      if (a.start.col !== b.start.col) return a.start.col - b.start.col;
      // 같은 시작점인 경우 긴 일정을 먼저 배치
      const aLength = (a.end.row - a.start.row) * 7 + (a.end.col - a.start.col);
      const bLength = (b.end.row - b.start.row) * 7 + (b.end.col - b.start.col);
      return bLength - aLength;
    });

    // 각 막대의 수직 위치를 할당하고 겹침을 해결
    const processedBars = [...bars];
    const rowHeights: number[][] = Array(6).fill(null).map(() => Array(7).fill(0));

    processedBars.forEach((bar) => {
      let verticalPosition = 0;
      let foundPosition = false;

      while (!foundPosition) {
        foundPosition = true;
        // 현재 막대와 이전에 배치된 모든 막대들과의 겹침 확인
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

      // 해당 위치의 높이 업데이트
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
      <div className="flex items-center justify-center gap-4 mb-4">
        <button 
          onClick={handlePrevMonth}
          className="px-3 py-1 border rounded hover:bg-gray-100"
          disabled={currentDate.getFullYear() === 2025 && currentDate.getMonth() === 0}
        >
          ◀
        </button>
        
        <div className="text-2xl font-bold flex items-center gap-2">
          <span>2025년</span>
          <select 
            value={currentDate.getMonth()} 
            onChange={handleMonthChange}
            className="text-xl border rounded px-2 py-1"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {i + 1}월
              </option>
            ))}
          </select>
        </div>

        <button 
          onClick={handleNextMonth}
          className="px-3 py-1 border rounded hover:bg-gray-100"
          disabled={currentDate.getFullYear() === 2025 && currentDate.getMonth() === 11}
        >
          ▶
        </button>
      </div>
      
      <div className="relative">
        {/* 달력 그리드 - 배경만 */}
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

        {/* 일정 막대 */}
        {scheduleBars.map((bar) => {
          const top = `calc(${bar.start.row} * (6rem + 1px) + ${bar.verticalPosition * 1.75}rem + 2.5rem)`;
          const left = `calc(${bar.start.col} * (100% / 7))`;
          const width = bar.end.col - bar.start.col + 1;
          const widthStyle = `calc(${width} * (100% / 7) - 4px)`;

          return (
            <div
              key={bar.id}
              className={`absolute h-5 rounded-full flex items-center px-2 text-xs whitespace-nowrap overflow-hidden ${bar.color}`}
              style={{
                top,
                left,
                width: widthStyle,
              }}
            >
              {bar.text}
            </div>
          );
        })}

        {/* 날짜 숫자만 표시하는 그리드 - 배경 없음 */}
        <div className="grid grid-cols-7 gap-px relative">
          {/* 요일 헤더 - 투명 배경 */}
          {['일', '월', '화', '수', '목', '금', '토'].map(day => (
            <div key={day} className="p-2 text-center font-medium">
              {day}
            </div>
          ))}
          
          {/* 빈 셀 - 투명 배경 */}
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2 min-h-24" />
          ))}

          {/* 날짜 숫자 - 투명 배경 */}
          {days.map(day => (
            <div key={day.toISOString()} className="p-2 min-h-24">
              <div className="text-sm mb-1">{format(day, 'd')}</div>
            </div>
          ))}
        </div>
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