import React from "react";
import { CalendarEvent } from "./types";
import { dateToFormat } from "./utils";

type Props = {
  event: CalendarEvent;
  position: "start" | "end" | "middle" | "single";
  style?: React.CSSProperties;
};

const CalendarEventBar: React.FC<Props> = ({ event, position, style }) => {
  const getEventColor = (type: string, application: boolean) => {
    if (type === "실기" && application) return "bg-yellow-300";
    if (type === "실기" && !application) return "bg-yellow-500";
    if (type === "필기" && application) return "bg-blue-300";
    return "bg-blue-500";
  };

  const getTextColor = (position: string) => {
    return position === "start" ? "text-gray-900" : "text-transparent";
  };

  const getEventTitle = (type: string, application: boolean) => {
    if (application) return `[${type}]접수`;
    return `[${type}]시험`;
  };

  const slotHeight = 20;
  const topPosition = event.slot * slotHeight;

  let borderRadiusClasses = "";
  if (position === "start") {
    borderRadiusClasses = "rounded-l-md";
  } else if (position === "end") {
    borderRadiusClasses = "rounded-r-md";
  } else if (position === "single") {
    borderRadiusClasses = "rounded-md";
  }

  return (
    <div
      className={`text-xs font-semibold pl-2 ${borderRadiusClasses} ${getEventColor(
        event.type,
        event.application
      )} ${getTextColor(position)}`}
      style={{
        position: "absolute",
        top: `${topPosition}px`,
        left: "0",
        right: "0",
        ...style,
      }}
      title={`${getEventTitle(event.type, event.application)}: ${dateToFormat(
        event.start.toISOString(),
        "yyyy-MM-dd"
      )} ~ ${dateToFormat(event.end.toISOString(), "yyyy-MM-dd")}`}
    >
      <span 
        className="whitespace-nowrap"
        style={{ 
          position: position === "start" ? "relative" : undefined,
          zIndex: position === "start" ? 9999 : undefined 
        }}
      >
        {`${event.round}회 ${getEventTitle(event.type, event.application)}`}
      </span>
    </div>
  );
};

export default CalendarEventBar;