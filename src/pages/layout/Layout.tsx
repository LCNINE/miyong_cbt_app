import React from 'react';
import Header from './header/Header'; // Header 컴포넌트 import
import Footer from './footer/Footer'; // Footer 컴포넌트 import
import { Outlet, useLocation } from 'react-router-dom';
import { Pagination } from '@/components/Pagination';

// Props 타입 정의
// interface LayoutProps {
//   children: React.ReactNode;
// }

// Layout 컴포넌트 정의 및 props 타입 적용
// const Layout: React.FC<LayoutProps> = ({ children }) => {
const Layout = () => {

  const location = useLocation();

  // 특정 경로에서는 Header만 보여주기 위한 조건
  const isTestRoute = location.pathname === '/test';

  return (
    <div className='max-w-screen-md h-screen max-h-screen flex flex-col mx-auto shadow-md'>
      <Header />
      
      <main className='flex-1 overflow-y-auto '>
        <Outlet/>
      </main>

      {!isTestRoute && <Footer />}  {/* test 경로가 아닐 때만 Footer 보여줌 */}
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
