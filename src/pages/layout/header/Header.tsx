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
              <SheetTitle>뭔가 넣을 자리</SheetTitle>
              <SheetDescription>
                아직 뭐 넣을지 생각 안함
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
