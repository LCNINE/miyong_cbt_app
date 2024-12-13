'use client';
import { Helmet } from "react-helmet-async";
import ScheduleServices from '../../../services/schedules/services';
import { supabase } from '@/lib/supabaseClient';
import ExamCalendar from "./ExamCalendar";
import { useEffect, useState } from 'react';
import { Tables } from '@/type/database.types';

export default function Schedule() {
  const [schedules, setSchedules] = useState<Tables<'exam_schedules'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSchedules() {
      try {
        const scheduleService = new ScheduleServices(supabase);
        const fetchedSchedules = await scheduleService.getSchedules();
        setSchedules(fetchedSchedules);
      } catch (err) {
        // err의 타입을 확인하고 적절히 처리
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 에러가 발생했습니다';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedules();
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러가 발생했습니다: {error}</div>;
  }

  return (
    <>
      <Helmet>
        <title>미용필시시험/schedule - 미용필기시험 일정</title>
        <meta name="description" content="미용필기시험 일정" />
        <meta name="google-site-verification" content="LK2lMpCXPbmg_peIKBrco_0Rp_scYKp4Mn0u5yI6vCI" />
        <meta name="naver-site-verification" content="dd4919f9da4dfbafdd79f35ed97505cf41418c50" />
      </Helmet>
      <ExamCalendar schedules={schedules}/>
    </>
  );
}