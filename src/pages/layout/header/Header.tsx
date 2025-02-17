import { Button } from "@/components/ui/button";
import { useAuth } from "@/pages/auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth(); // 로그인 상태 확인 및 로그아웃 기능 가져오기

  // 홈 경로 확인 ("/"인 경우 뒤로가기 버튼을 숨김)
  const isHome = location.pathname === "/";
  const isTest = location.pathname === "/test";

  const goBack = () => {
    if (isTest) {
      const confirmExit = window.confirm("정말 시험을 포기하시겠습니까?");
      if (!confirmExit) {
        navigate('/');
        return; // 사용자가 "취소"를 누르면 함수가 여기서 종료됨
      }
    }
    navigate("/"); // 뒤로가기 기능
  };

  const handleSignOut = () => {
    signOut(); // 로그아웃 처리
    navigate("/");
  };

  function goAlmond() {
    window.open(
      "https://almondyoung.com/product/search.html?keyword=%EA%B5%AD%EA%B0%80%EA%B3%A0%EC%8B%9C+%EC%9B%90%ED%8C%A8%EC%8A%A4",
      "_blank"
    );
  }

  function handleSignIn() {
    navigate("/sign-in", { state: { from: location } });
  }

  return (
    <div className="flex justify-between items-center p-4 border-b h-[60px]">
      {/* 왼쪽 뒤로가기 아이콘 (홈에서는 안보임) */}
      {!isHome && (
        <button onClick={goBack} className="text-2xl">
          &lt; {/* 뒤로가기 아이콘 */}
        </button>
      )}

      {/* 중앙의 제목 */}
      <h1 className="absolute left-[-9999px]">
        미용 필기시험 준비를 위한 기출문제와 최신 정보
      </h1>
      {/* <h1>미용필기시험</h1> */}
      <div className="text-xl font-bold text-gray-900 xs:tracking-tight xs:text-base xs:font-semibold">
        {isTest ?
          <div className="text-xl font-bold text-gray-900 xs:tracking-tight xs:text-base xs:font-semibold">
            미용필기시험
          </div>
          :
          <button onClick={goBack}>
            미용필기시험
          </button>
        }
      </div>

      {!isTest && (
        <div className="text-right">
          <Button onClick={goAlmond} className="w-20 mr-2">
            무료문제집
          </Button>
          {user ? (
            <>
              <Button onClick={handleSignOut} className="w-28">
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSignIn} className="w-28">
                로그인/회원가입
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
