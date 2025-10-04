import { useEffect, useState } from 'react';

/**
 * 深色模式检测和管理的自定义Hook
 * @returns {Object} 包含深色模式状态和切换函数的对象
 */
export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 检测系统深色模式偏好
  useEffect(() => {
    // 检查是否在浏览器环境中
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    // 根据系统偏好设置初始主题
    if (mediaQuery.matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 监听系统主题变化
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    // 清理函数
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // 切换深色模式
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // 设置深色模式
  const setDarkMode = (dark: boolean) => {
    setIsDarkMode(dark);
    
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode
  };
};

export default useDarkMode;