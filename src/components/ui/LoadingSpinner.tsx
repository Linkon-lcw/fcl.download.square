import React from "react";
import { LoadingSpinnerProps } from "@/types";

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', message = '加载中...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className={`border-[var(--primary)] border-t-2 border-b-2 rounded-full ${sizeClasses[size]} animate-spin`}></div>
      {message && (
        <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;