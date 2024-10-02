import { Link, useLocation } from 'react-router-dom';
import { FaRobot, FaRedo } from 'react-icons/fa';

export default function Footer() {
  const currentPath = useLocation().pathname;

  const linkClasses = (path:string) =>
    `flex-1 flex flex-col items-center py-2 ${
      currentPath === path ? 'text-black' : 'text-gray-400'
    }`;

  const iconClasses = (path:string) =>
    `w-6 h-6 mb-1 ${
      currentPath === path ? 'text-black' : 'text-gray-400'
    }`;

  return (
    <div className="w-full border-t border-gray-200 flex">
      <Link to="/retest" className={linkClasses('/retest')}>
        <FaRedo className={iconClasses('/retest')} />
        <span className="text-sm">다시보기</span>
      </Link>
      <Link to="/ai" className={linkClasses('/ai')}>
        <FaRobot className={iconClasses('/ai')} />
        <span className="text-sm">AI</span>
      </Link>
    </div>
  );
}
