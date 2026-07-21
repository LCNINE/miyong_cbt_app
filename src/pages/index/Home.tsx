import { Helmet } from 'react-helmet-async';
import { ComboboxForm } from './combo/ComboboxForm';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className='relative flex flex-col items-center justify-center h-full bg-white'>
      <Helmet>
        <title>미용필기시험/ - 미용필기시험 root page</title>
        <meta name='description' content='미용필기시험 root page' />
        <meta
          name='google-site-verification'
          content='LK2lMpCXPbmg_peIKBrco_0Rp_scYKp4Mn0u5yI6vCI'
        />
        <meta
          name='naver-site-verification'
          content='dd4919f9da4dfbafdd79f35ed97505cf41418c50'
        />
      </Helmet>
      <div className='flex items-center justify-center flex-1 w-full h-full'>
        <ComboboxForm />
      </div>
      <div className='flex items-end justify-between w-full p-4 flex-0'>
        <Button asChild variant='link'>
          <Link to='/schedule' className='gap-2'>
            <Calendar size={20} />
            연간일정 보러가기
          </Link>
        </Button>
        {/* 카카오톡 문의하기 버튼 */}
        <Button asChild variant='link'>
          <Link
            to='http://pf.kakao.com/_xaxgxazs'
            target='_blank'
            rel='noopener noreferrer'
          >
            카카오톡 문의하기
          </Link>
        </Button>
      </div>
    </div>
  );
}
