import React from "react";
import Header from "./header/Header"; // Header 컴포넌트 import
import Footer from "./footer/Footer"; // Footer 컴포넌트 import
import { matchPath, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

// Props 타입 정의
// interface LayoutProps {
//   children: React.ReactNode;
// }

// Layout 컴포넌트 정의 및 props 타입 적용
// const Layout: React.FC<LayoutProps> = ({ children }) => {
const Layout = () => {
  const location = useLocation();

  // Test/Result 경로는 자체 헤더를 사용하므로 공용 Header/Footer를 숨김
  const isTestRoute = !!matchPath("/test/:test_id", location.pathname);
  const isResultRoute = location.pathname === "/result";
  const hideChrome = isTestRoute || isResultRoute;

  return (
    <div className="max-w-screen-md h-screen max-h-screen flex flex-col mx-auto shadow-md print:h-auto print:max-h-none print:shadow-none">
      {!hideChrome && <div className="contents print:hidden"><Header /></div>}
      <main className="flex-1 overflow-y-auto print:overflow-visible">
        <Outlet />
        <Toaster />
      </main>
      {!hideChrome && <div className="contents print:hidden"><Footer /></div>}
    </div>
  );
};

export default Layout;
