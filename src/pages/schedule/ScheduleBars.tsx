import React from 'react';
import { ScheduleBar } from './types';

interface ScheduleBarsProps {
  scheduleBars: ScheduleBar[];
}

export const ScheduleBars: React.FC<ScheduleBarsProps> = ({ scheduleBars }) => (
  <>
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
  </>
);

