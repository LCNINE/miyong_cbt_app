import React from 'react';
import { format } from 'date-fns';

interface CalendarGridProps {
  days: Date[];
  startOffset: number;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ days, startOffset }) => (
  <div className="grid grid-cols-7 gap-px relative">
    {['일', '월', '화', '수', '목', '금', '토'].map(day => (
      <div key={day} className="p-2 text-center font-medium">
        {day}
      </div>
    ))}
    
    {Array.from({ length: startOffset }).map((_, i) => (
      <div key={`empty-${i}`} className="p-2 min-h-24" />
    ))}

    {days.map(day => (
      <div key={day.toISOString()} className="p-2 min-h-24">
        <div className="text-sm mb-1">{format(day, 'd')}</div>
      </div>
    ))}
  </div>
);

