// src/pages/schedule/CalendarEventBar.tsx
import React from "react";
import { CalendarEvent } from "./types";
import { dateToFormat } from "./utils";

type Props = {
  event: CalendarEvent;
  position: 'start' | 'end' | 'middle' | 'single'; // 새로운 prop 추가
  style?: React.CSSProperties;
};

const CalendarEventBar: React.FC<Props> = ({ event, position, style }) => {
  const getEventColor = (type: string, application: boolean) => {
    if (type === "실기" && application) return "bg-yellow-300";
    if (type === "실기" && !application) return "bg-yellow-500";
    if (type === "필기" && application) return "bg-blue-300";
    return "bg-blue-500";
  };

  const getEventTitle = (type: string, application: boolean) => {
    if (application) return `[${type}]접수`;
    return `[${type}]시험`;
  };

  // 슬롯에 따른 Y축 위치 계산 (예: 슬롯 0: 0px, 슬롯 1: 20px, 슬롯 2: 40px, 슬롯 3: 60px)
  const slotHeight = 20; // 각 슬롯의 높이 (px 단위)
  const topPosition = event.slot * slotHeight;

  // 위치에 따른 둥글기 클래스 적용
  let borderRadiusClasses = "";
  if (position === 'start') {
    borderRadiusClasses = "rounded-l-md";
  } else if (position === 'end') {
    borderRadiusClasses = "rounded-r-md";
  } else if (position === 'single') {
    borderRadiusClasses = "rounded-md";
  }

  return (
    <div
      className={`text-xs text-gray-900 font-semibold px-1 ${borderRadiusClasses} ${getEventColor(
        event.type,
        event.application
      )}`}
      style={{
        position: "absolute",
        top: `${topPosition}px`,
        left: "0",
        right: "0",
        // 필요 시 추가적인 스타일을 여기에 작성
        ...style,
      }}
      title={`${getEventTitle(event.type, event.application)}: ${dateToFormat(
        event.start.toISOString(),
        "yyyy-MM-dd"
      )} ~ ${dateToFormat(event.end.toISOString(), "yyyy-MM-dd")}`}
    >
      {`${event.round}회 ${getEventTitle(event.type, event.application)}`}
    </div>
  );
};

export default CalendarEventBar;
