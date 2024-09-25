import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // 홈 경로 확인 ("/"인 경우 뒤로가기 버튼을 숨김)
  const isHome = location.pathname === '/';
  const isTest = location.pathname === '/test';

  const goBack = () => {
    if(isTest){
      const confirmExit = window.confirm("정말 시험을 포기하시겠습니까?");
      if (!confirmExit) {
        return; // 사용자가 "취소"를 누르면 함수가 여기서 종료됨
      }
    }
    navigate(-1);  // 뒤로가기 기능
  };

  return (
    <div className="flex justify-between items-center p-4 border-b h-[60px]">
      {/* 왼쪽 뒤로가기 아이콘 (홈에서는 안보임) */}
      {!isHome && (
        <button onClick={goBack} className="text-2xl">
          &lt;  {/* 뒤로가기 아이콘 */}
        </button>
      )}

      {/* 중앙의 제목 */}
      <h1 className="text-xl font-bold">미용CBT</h1>

      {!isTest && (
        <Sheet>
          <SheetTrigger className='font-bold'>&#x22EE;</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>MY</SheetTitle>
              <SheetDescription>
                <div><a href='/sign-in'>로그인/회원가입 하기</a></div>
                <div><a href='https://almondyoung.com/product/search.html?keyword=%EA%B5%AD%EA%B0%80%EA%B3%A0%EC%8B%9C+%EC%9B%90%ED%8C%A8%EC%8A%A4'>무료 문제집 다운로드</a></div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
