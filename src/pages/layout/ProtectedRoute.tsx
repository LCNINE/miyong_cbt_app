import { useAuth } from "../auth/AuthContext"; // 경로는 프로젝트 구조에 맞게 수정
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 로딩 중일 때 (세션 확인 중)
  if (loading) {
    return <div>Loading...</div>; // 로딩 스피너 추가 가능
  }

  // 로그인하지 않은 경우, 현재 위치를 state로 저장하여 로그인 페이지로 리디렉트
  if (!user) {
    return (
      <Navigate
        to="/sign-in"
        replace
        state={{ from: location }} // 로그인 후 돌아올 경로를 state에 저장
      />
    );
  }

  // 로그인된 경우에만 자식 요소 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;
