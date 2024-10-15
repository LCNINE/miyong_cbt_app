import SampleAi from "../ai/SampleAi";
import { useAuth } from "../auth/AuthContext"; // 경로는 프로젝트 구조에 맞게 수정

const ProtectedRouteForSampleAi = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // 로딩 중일 때 (세션 확인 중)
  if (loading) {
    return <div>Loading...</div>; // 로딩 스피너 추가 가능
  }

  // 로그인하지 않은 경우, Sample AI 페이지로 리디렉션
  if (!user) {
    console.log("not logged in");
    return <SampleAi />; // Sample AI 페이지를 바로 렌더링
  }

  // 로그인된 경우에만 자식 요소 렌더링
  return <>{children}</>;
};

export default ProtectedRouteForSampleAi;
