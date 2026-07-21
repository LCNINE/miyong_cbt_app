import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PencilLine } from 'lucide-react';
import Calendar1 from './Calendar1';

function ExamSchedulePage() {
  const year = new Date().getFullYear();
  return (
    <div>
      <Helmet>
        <title>미용필기시험/ 미용필기시험 미용사자격증 연간일정</title>
        <meta
          name='description'
          content={`미용시험 일정, 미용필기시험 연간 일정, ${year}년 미용사 자격증 일정, 미용사 시험 달력`}
        />
        <meta
          name='google-site-verification'
          content='LK2lMpCXPbmg_peIKBrco_0Rp_scYKp4Mn0u5yI6vCI'
        />
        <meta
          name='naver-site-verification'
          content='dd4919f9da4dfbafdd79f35ed97505cf41418c50'
        />
      </Helmet>
      {/* 검색 유입자가 바로 문제풀이로 갈 수 있는 진입점 */}
      <div className='p-4'>
        <Link
          to='/'
          className='flex w-full items-center justify-center gap-2 rounded-2xl bg-brand px-6 py-5 text-xl font-bold text-white shadow-card transition hover:bg-brand-deep active:scale-[0.99]'
        >
          <PencilLine size={24} />
          기출문제 무료로 풀어보기
        </Link>
      </div>

      <Calendar1 />
    </div>
  );
}

export default ExamSchedulePage;
