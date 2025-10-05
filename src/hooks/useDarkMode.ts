import { useState, useEffect } from "react";

/**
 * 深色模式Hook
 * @returns {Object} 包含深色模式状态和切换函数的对象
 */
const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 检查本地存储中是否有深色模式设置
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    } else {
      // 如果没有保存的设置，检查系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    
    // 添加系统主题变化监听器
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // 只有在没有用户手动设置的情况下才跟随系统变化
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };
    
    // 添加事件监听器
    mediaQuery.addEventListener('change', handleChange);
    
    // 清理函数，组件卸载时移除监听器
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    // 当深色模式状态改变时，更新HTML元素的类
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // 保存设置到本地存储
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return { isDarkMode, toggleDarkMode };
};

export default useDarkMode;