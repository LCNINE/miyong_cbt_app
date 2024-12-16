// src/pages/schedule/Calendar.tsx
import React, { useState, useEffect } from 'react';
import { getDaysInMonth, isSameDayAsDate } from './utils';
import { CalendarEvent, ExamSchedule } from './types';
import { subMonths, addMonths, format, isBefore, isAfter, parseISO } from 'date-fns';
import CalendarDay from './CalendarDay';
import { supabase } from '@/lib/supabaseClient';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const daysInMonth = getDaysInMonth(currentDate);
  const startOfMonth = daysInMonth[0];
  const endOfMonth = daysInMonth[daysInMonth.length - 1];

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const { data, error } = await supabase
          .from('exam_schedules')
          .select('*')
          .order('exam_type, exam_round, application_starts_at');
        if (error) {
          console.error('스케줄을 가져오는 중 오류 발생:', error);
          return;
        }
        setExamSchedules(data as ExamSchedule[]);
      } catch (error) {
        console.error('스케줄을 가져오는 중 예외 발생:', error);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    if (examSchedules.length === 0) {
      setCalendarEvents([]);
      return;
    }

    // Step 1: 현재 월과 겹치는 이벤트만 필터링
    const allEvents: CalendarEvent[] = [];
    examSchedules.forEach(schedule => {
      const applicationStart = parseISO(schedule.application_starts_at);
      const applicationEnd = parseISO(schedule.application_ends_at);
      const examStart = parseISO(schedule.starts_at);
      const examEnd = parseISO(schedule.ends_at);

      // 현재 월과 겹치는지 확인
      if (
        (isBefore(applicationStart, endOfMonth) && isAfter(applicationEnd, startOfMonth)) ||
        (isBefore(examStart, endOfMonth) && isAfter(examEnd, startOfMonth))
      ) {
        // 접수 이벤트
        if (
          isBefore(applicationStart, endOfMonth) &&
          isAfter(applicationEnd, startOfMonth)
        ) {
          allEvents.push({
            id: schedule.id,
            start: applicationStart < startOfMonth ? startOfMonth : applicationStart,
            end: applicationEnd > endOfMonth ? endOfMonth : applicationEnd,
            type: schedule.exam_type,
            application: true,
            round: schedule.exam_round,
            slot: -1
          });
        }

        // 시험 이벤트
        if (
          isBefore(examStart, endOfMonth) &&
          isAfter(examEnd, startOfMonth)
        ) {
          allEvents.push({
            id: schedule.id,
            start: examStart < startOfMonth ? startOfMonth : examStart,
            end: examEnd > endOfMonth ? endOfMonth : examEnd,
            type: schedule.exam_type,
            application: false,
            round: schedule.exam_round,
            slot: -1
          });
        }
      }
    });

    if (allEvents.length === 0) {
      setCalendarEvents([]);
      return;
    }

    // Step 2: 이벤트 정렬 (시작일, 라운드, 타입 순)
    allEvents.sort((a, b) => {
      // 1. 시작일 오름차순
      if (a.start.getTime() !== b.start.getTime()) {
        return a.start.getTime() - b.start.getTime();
      }

      // 2. 라운드 번호 오름차순
      if (a.round !== b.round) {
        return a.round - b.round;
      }

      // 3. 시험 타입 우선순위 ("필기" 먼저)
      const typeOrder = { "필기": 0, "실기": 1 };
      return typeOrder[a.type] - typeOrder[b.type];
    });

    // Step 3: 슬롯 할당 (0-3)
    // const assignedSlots: { [key: number]: number } = {}; // event.id -> slot
    const activeEvents: CalendarEvent[] = [];

    allEvents.forEach(event => {
      // 현재 이벤트 시작 전에 끝난 이벤트는 activeEvents에서 제거
      for (let i = activeEvents.length - 1; i >= 0; i--) {
        if (activeEvents[i].end < event.start) {
          activeEvents.splice(i, 1);
        }
      }

      // 현재 사용 중인 슬롯 확인
      const usedSlots = activeEvents.map(activeEvent => activeEvent.slot);

      // 사용 가능한 가장 작은 슬롯 찾기
      let availableSlot = -1;
      for (let slot = 0; slot <= 3; slot++) {
        if (!usedSlots.includes(slot)) {
          availableSlot = slot;
          break;
        }
      }

      // 슬롯 할당
      if (availableSlot !== -1) {
        event.slot = availableSlot;
      } else {
        // 모든 슬롯이 사용 중인 경우, 슬롯 3 할당 (규칙 5)
        event.slot = 3;
      }

      // activeEvents에 현재 이벤트 추가
      activeEvents.push(event);
    });

    setCalendarEvents(allEvents);
  }, [examSchedules, currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth} className="bg-gray-200 px-2 py-1 rounded">&lt;</button>
        <h2 className="text-xl font-bold">{format(currentDate, 'yyyy년 MM월')}</h2>
        <button onClick={handleNextMonth} className="bg-gray-200 px-2 py-1 rounded">&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['일', '월', '화', '수', '목', '금', '토'].map(day => (
          <div key={day} className="text-center font-semibold">{day}</div>
        ))}
        {daysInMonth.map(day => (
          <CalendarDay
            key={day.toISOString()}
            date={day}
            events={calendarEvents.filter(
              event =>
                isSameDayAsDate(event.start, day) ||
                (event.start < day && event.end >= day)
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
