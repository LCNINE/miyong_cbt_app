import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TestHeaderProps {
  confirmExit?: boolean;
}

export default function TestHeader({ confirmExit = false }: TestHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (confirmExit) {
      const ok = window.confirm("정말 시험을 포기하시겠습니까?");
      if (!ok) return;
    }
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-4 border-b h-[60px] bg-white">
      <button
        onClick={handleBack}
        className="flex items-center gap-1 text-slate-700 hover:text-slate-900"
        aria-label="뒤로 가기"
      >
        <ChevronLeft size={20} />
        <span className="text-sm">뒤로</span>
      </button>

      <div className="flex items-center gap-2">
        <img
          src="/miyongPilgiLogo.png"
          alt="미용필기시험"
          className="h-7 w-7"
        />
        <span className="font-semibold text-slate-900 xs:text-sm">
          미용필기시험
        </span>
      </div>
    </div>
  );
}
