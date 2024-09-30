import {Link, useLocation} from 'react-router-dom';

export default function Footer(){
  const currentPath = useLocation().pathname;
  return (
    <div className="w-full h-12 bg-gray-100 border-t border-gray-300 flex justify-around py-3 relative">
      
      <Link to="/retest" className={`w-1/3 ${currentPath === '/retest' ? 'font-bold tracking-tight' : 'tracking-wide'}`}>
        <div className="text-center">
          <p>틀린문제 다시보기</p>
        </div>
      </Link>

      <div className="h-full w-px bg-black"></div> {/* 두 번째 구분선 */}

      <Link to="/ai" className={`w-1/3 ${currentPath === '/ai' ? 'font-bold tracking-tight' : 'tracking-wide'}`}>
        <div className="text-center">
          <p>AI</p>
        </div>
      </Link>

    </div>
  )
}
