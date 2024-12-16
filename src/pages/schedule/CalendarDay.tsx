// src/pages/schedule/CalendarDay.tsx
import React from "react";
import CalendarEventBar from "./CalendarEventBar";
import { CalendarEvent } from "./types";
import { isSameDayAsDate } from "./utils";

type Props = {
  date: Date;
  events: CalendarEvent[];
};

const CalendarDay: React.FC<Props> = ({ date, events }) => {
  const isToday = (d: Date) => {
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  // 이벤트를 슬롯 순으로 정렬
  const sortedEvents = [...events].sort((a, b) => a.slot - b.slot);

  return (
    <div
      className={`border-t relative flex flex-col min-h-[120px] ${
        isToday(date) ? "border-blue-500" : "border-gray-200"
      }`}
    >
      <div className="text-sm text-center text-gray-700">{date.getDate()}</div>
      {/* 이벤트를 절대 위치로 배치하기 위해 Container를 추가 */}
      <div className="absolute top-6 left-0 right-0">
        {sortedEvents.map((event) => {
          // 현재 날짜가 이벤트의 시작일인지, 종료일인지 확인
          const isStart = isSameDayAsDate(event.start, date);
          const isEnd = isSameDayAsDate(event.end, date);
          let position: 'start' | 'end' | 'middle' | 'single' = 'middle';

          if (isStart && isEnd) {
            position = 'single';
          } else if (isStart) {
            position = 'start';
          } else if (isEnd) {
            position = 'end';
          } else {
            position = 'middle';
          }

          return (
            <CalendarEventBar
              key={`${event.id}-${event.application ? 'app' : 'exam'}`}
              event={event}
              position={position}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarDay;
