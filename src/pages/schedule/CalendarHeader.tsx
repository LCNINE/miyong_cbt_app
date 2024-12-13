import React from 'react';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onMonthChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onMonthChange
}) => (
  <div className="flex items-center justify-center gap-4 mb-4">
    <button 
      onClick={onPrevMonth}
      className="px-3 py-1 border rounded hover:bg-gray-100"
      disabled={currentDate.getFullYear() === 2025 && currentDate.getMonth() === 0}
    >
      ◀
    </button>
    
    <div className="text-2xl font-bold flex items-center gap-2">
      <span>2025년</span>
      <select 
        value={currentDate.getMonth()} 
        onChange={onMonthChange}
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
      onClick={onNextMonth}
      className="px-3 py-1 border rounded hover:bg-gray-100"
      disabled={currentDate.getFullYear() === 2025 && currentDate.getMonth() === 11}
    >
      ▶
    </button>
  </div>
);

