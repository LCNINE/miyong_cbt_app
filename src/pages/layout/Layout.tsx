import React from 'react';
import Header from './header/Header'; // Header 컴포넌트 import
import Footer from './footer/Footer'; // Footer 컴포넌트 import
import { Outlet } from 'react-router-dom';

// Props 타입 정의
// interface LayoutProps {
//   children: React.ReactNode;
// }

// Layout 컴포넌트 정의 및 props 타입 적용
// const Layout: React.FC<LayoutProps> = ({ children }) => {
const Layout = () => {
  return (
    <div className='max-w-screen-md h-screen max-h-screen flex flex-col mx-auto shadow-md'>
      <Header />
      
      <main className='flex-1 overflow-y-auto '>
        <Outlet/>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
