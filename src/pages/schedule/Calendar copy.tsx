import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScheduleServices from '../../../services/schedules/services';
import { supabase } from '@/lib/supabaseClient';
import { Database, Tables } from '@/type/database.types';

type EventType = {
  type: string;
  round: number;
  color: string;
};

type ExamTypeEnum = Database['public']['Enums']['exam_type_enum'];

export default function ExamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [examData, setExamData] = useState<Tables<'exam_schedules'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await new ScheduleServices(supabase).getSchedules();
        setExamData(data);
      } catch (error) {
        console.error('Failed to fetch exam schedules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const findExams = (date: Date): EventType[] => {
    const events: EventType[] = [];

    examData.forEach(exam => {
      // 원서접수 기간 체크
      if (isWithinInterval(date, {
        start: new Date(exam.application_starts_at),
        end: new Date(exam.application_ends_at)
      })) {
        events.push({
          type: `${exam.exam_type} 원서접수`,
          round: exam.exam_round,
          color: exam.exam_type === '필기' as ExamTypeEnum ? 'bg-blue-200' : 'bg-green-200'
        });
      }

      // 시험 기간 체크
      if (isWithinInterval(date, {
        start: new Date(exam.starts_at),
        end: new Date(exam.ends_at)
      })) {
        events.push({
          type: `${exam.exam_type}시험`,
          round: exam.exam_round,
          color: exam.exam_type === '필기' as ExamTypeEnum ? 'bg-blue-400' : 'bg-green-400'
        });
      }

      // 합격발표일 체크 (실기시험만)
      if (exam.success_announ_at && isSameDay(date, new Date(exam.success_announ_at))) {
        events.push({
          type: '실기 합격발표',
          round: exam.exam_round,
          color: 'bg-green-600'
        });
      }
    });

    return events;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">
          {format(currentDate, 'yyyy년 M월', { locale: ko })}
        </h2>
        <button onClick={nextMonth} className="p-2">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="text-center font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day) => {
          const events = findExams(day);
          return (
            <div
              key={day.toString()}
              className="border min-h-24 p-1"
            >
              <div className={`text-sm mb-1 ${
                format(day, 'MM') !== format(currentDate, 'MM')
                  ? 'text-gray-300'
                  : ''
              }`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`${event.color} text-xs p-1 rounded truncate`}
                    title={`${event.type} ${event.round}회차`}
                  >
                    {event.type} {event.round}회
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-200 mr-2"></div>
          <span className="text-sm">필기 원서접수</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-400 mr-2"></div>
          <span className="text-sm">필기시험</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-200 mr-2"></div>
          <span className="text-sm">실기 원서접수</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-400 mr-2"></div>
          <span className="text-sm">실기시험</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-600 mr-2"></div>
          <span className="text-sm">실기 합격발표</span>
        </div>
      </div>
    </div>
  );
}