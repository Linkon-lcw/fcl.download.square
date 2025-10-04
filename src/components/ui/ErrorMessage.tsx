import React from "react";
import { ErrorMessageProps } from "@/types";

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = "" }) => {
  return (
    <div className={`bg-red-100 dark:bg-red-900 px-4 py-3 border border-red-400 rounded text-red-700 dark:text-red-200 ${className}`}>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;