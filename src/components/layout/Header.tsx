"use client";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faDownload, faSun, faMoon, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import useDarkMode from "@/hooks/useDarkMode";

// 样式生成函数
const getButtonClasses = (isActive: boolean) => {
  const baseClasses = "group relative flex items-start px-[10px] py-2 rounded-[20px] transition-all duration-300 h-[40px] max-w-[40px] w-auto overflow-hidden";
  const activeClasses = "bg-background items-start rounded-none rounded-t-md w-[120px] max-w-[120px] h-[64px] mt-4 pt-3 overflow-visitable";
  const inactiveClasses = "bg-transparent hover:bg-gray-500/60 dark:hover:bg-gray-600/60 max-w-[40px] hover:max-w-[120px] active:rounded-xl active:mt-4 active:h-[64px] active:items-start active:mt-4 active:pt-3";
  
  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

const getTextClasses = (isActive: boolean) => {
  const baseClasses = "ml-[10px] whitespace-nowrap transition-all duration-300 opacity-0";
  const activeClasses = "opacity-100 max-w-full pr-1";
  const inactiveClasses = "pr-1 group-hover:opacity-100 ";
  
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
      <div className="flex justify-center items-center">
      <div className={`flex justify-center items-center w-[20px] h-[20px]`}>
        <FontAwesomeIcon icon={icon} className="text-[18px]" />
      </div>
      <span className={getTextClasses(isActive)}>
        {text}
      </span></div>
    </button>
  );
};

export default function Header({ currentPage, onPageChange }: { currentPage: string; onPageChange: (page: string) => void }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header 
    className="top-4 right-4 left-4 z-50 fixed justify-items-center items-center grid grid-cols[64px_2fr_1fr] md:grid-cols-3 row-start-1 bg-black/10 dark:bg-white/10 shadow-md backdrop-blur-sm border-1 border-black/5 rounded-full w-[calc(100%-32px)] h-16 max-h-[64px] overflow-visitable">
      <div className="flex flex-row justify-start items-center col-start-1 w-full h-full">
      <div className="flex flex-row justify-items-center items-start col-start-1 p-3 pl-[10px] w-full max-w-16 md:max-w-[300px] h-auto text-center">
        <Image
          className="w-[40px] h-[40px] translate-y-[-2px]"
          src="/image/FCL_icon.webp"
          alt="Fold Craft Launcher logo" 
          width={40}
          height={40}
        />
        <p className="pl-1 overflow-hidden md:overflow-visitable font-bold text-2xl whitespace-nowrap">Fold Craft Launcher</p>
      </div></div>
      
      {/* 导航菜单 - 中间位置 */}
      <div className="flex flex-row justify-center items-center gap-4 col-start-2 w-auto max-h-[64px] overflow-visitable">
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
      
      <div className="flex flex-row justify-end items-center col-start-3 p-3 w-full h-full text-center">
        <button onClick={toggleDarkMode} className="flex justify-center items-center bg-transparent hover:bg-gray-500/60 dark:hover:bg-gray-600/60 rounded-full w-10 h-10 transition-all duration-300">
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} className="text-[18px]" />
        </button>
      </div>
    </header>
  );
}