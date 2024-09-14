import {Link, useLocation} from 'react-router-dom';

export default function Footer(){
  const currentPath = useLocation().pathname;
  return (
    <div className="w-full h-12 bg-gray-100 border-t border-gray-300 flex justify-around py-3">
      <Link to="/retest" className={`w-1/3 ${currentPath === '/retest' ? 'font-bold tracking-tight' : 'tracking-wide'}`}>
        <div className="text-center">
          <p>복습하기</p>
        </div>
      </Link>

      <Link to="/" className={`w-1/3 ${currentPath === '/' ? 'font-bold tracking-tight' : ''}`}>
        <div className="text-center">
          <p>학습하기</p>
        </div>
      </Link>

      <Link to="/ai" className={`w-1/3 ${currentPath === '/ai' ? 'font-bold tracking-tight' : 'tracking-wide'}`}>
        <div className="text-center">
          <p>AI</p>
        </div>
      </Link>
    </div>
  )
}

// 현재 어떤 페이지인지 나타나게 하고싶다.