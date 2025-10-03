import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faDownload, IconDefinition } from "@fortawesome/free-solid-svg-icons";

// 样式生成函数
const getButtonClasses = (isActive: boolean) => {
  const baseClasses = "group relative flex items-center px-[10px] py-2 rounded-lg transition-all duration-300 min-w-[40px] max-w-[120px] overflow-hidden";
  const activeClasses = "bg-blue-500 text-white w-[80px]";
  const inactiveClasses = "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 w-[40px] hover:w-[80px]";
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

const getTextClasses = (isActive: boolean) => {
  const baseClasses = "ml-2 whitespace-nowrap transition-all duration-300";
  const activeClasses = "opacity-100 max-w-full";
  const inactiveClasses = "opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-full";
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

// 导航按钮组件
const NavButton = ({ 
  page, 
  currentPage, 
  onPageChange, 
  icon, 
  text 
}: { 
  page: string;
  currentPage: string;
  onPageChange: (page: string) => void;
  icon: IconDefinition;
  text: string;
}) => {
  const isActive = currentPage === page;
  
  return (
    <button 
      onClick={() => onPageChange(page)}
      className={getButtonClasses(isActive)}
    >
      <FontAwesomeIcon icon={icon} className="text-[20px]" />
      <span className={getTextClasses(isActive)}>
        {text}
      </span>
    </button>
  );
};

export default function Header({ currentPage, onPageChange }: { currentPage: string; onPageChange: (page: string) => void }) {
  return (
    <header className="justify-items-center items-center grid grid-cols-3 row-start-1 bg-black/1 dark:bg-white/5 shadow-md border-1 border-black/5 rounded-b-2xl w-screen h-16">
      <div className="flex flex-row justify-items-center items-start col-start-1 p-3 w-full h-full text-center">
        <Image
          src="/image/FCL_icon.webp"
          alt="Fold Craft Launcher logo" 
          width={40}
          height={40}
        />
        <p className="font-bold text-2xl">Fold Craft Launcher</p>
      </div>
      
      {/* 导航菜单 - 中间位置 */}
      <div className="flex flex-row justify-center items-center gap-8 col-start-2">
        <NavButton 
          page="home"
          currentPage={currentPage}
          onPageChange={onPageChange}
          icon={faHome}
          text="首页"
        />
        
        <NavButton 
          page="download"
          currentPage={currentPage}
          onPageChange={onPageChange}
          icon={faDownload}
          text="下载"
        />
      </div>
      
      <div className="flex flex-row justify-items-center items-end col-start-3 w-full h-full text-center">
        <button  onClick={() => {
          document.documentElement.classList.toggle("dark");
        }}>切换深色模式</button>
      </div>
    </header>
  );
}