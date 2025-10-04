"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faDownload, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import useDarkMode from "../utils/useDarkMode";

// 样式生成函数
const getButtonClasses = (isActive: boolean) => {
  const baseClasses = "group relative flex items-center px-[10px] py-2 rounded-[20px] transition-all duration-300 min-w-[40px] w-auto overflow-hidden";
  const activeClasses = "bg-gray-700 text-white w-[80px] rounded-xl";
  const inactiveClasses = "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 max-w-[40px] hover:max-w-[120px] active:rounded-xl";
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

const getTextClasses = (isActive: boolean) => {
  const baseClasses = "ml-2 whitespace-nowrap transition-all duration-300";
  const activeClasses = "opacity-100 max-w-full pr-1";
  const inactiveClasses = "opacity-0 max-w-0 pr-1 group-hover:opacity-100 group-hover:max-w-full";
  
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
      <div className="flex justify-center items-center w-[20px] h-[20px]">
        <FontAwesomeIcon icon={icon} className="text-[18px]" />
      </div>
      <span className={getTextClasses(isActive)}>
        {text}
      </span>
    </button>
  );
};

export default function Header({ currentPage, onPageChange }: { currentPage: string; onPageChange: (page: string) => void }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header 
    className="top-4 right-4 left-4 z-50 fixed justify-items-center items-center grid grid-cols-1 md:grid-cols-3 row-start-1 bg-black/1 dark:bg-white/5 shadow-md backdrop-blur-sm border-1 border-black/5 rounded-full w-[calc(100%-32px)] h-auto md:h-16">
      <div className="flex flex-row justify-items-center items-start col-start-1 p-3 w-full max-w-16 md:max-w-[300px] h-full text-center">
        <Image
          className="w-[40px] h-[40px] translate-y-[-5px]"
          src="/image/FCL_icon.webp"
          alt="Fold Craft Launcher logo" 
          width={40}
          height={40}
        />
        <p className="overflow-visible font-bold text-2xl whitespace-nowrap">Fold Craft Launcher</p>
      </div>
      
      {/* 导航菜单 - 中间位置 */}
      <div className="flex flex-row justify-center items-center gap-4 col-start-1 md:col-start-2 w-auto">
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
      
      <div className="flex flex-row justify-items-center items-end col-start-1 md:col-start-3 w-auto w-full h-full text-center">
        <button onClick={toggleDarkMode}>
          {isDarkMode ? '切换浅色模式' : '切换深色模式'}
        </button>
      </div>
    </header>
  );
}