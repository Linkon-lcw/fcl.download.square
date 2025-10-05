import React from 'react';
import DownloadButton from '@/components/ui/DownloadButton';
import { UnifiedItem, UnifiedDirectory, UnifiedFile } from '@/services/downloadUtils';

interface NestedDirectoryViewProps {
  items: UnifiedItem[];
  level?: number;
}

/**
 * 递归渲染嵌套目录结构的组件
 * 支持无限嵌套的目录结构，并自动适应深色模式和响应式布局
 */
export default function NestedDirectoryView({ items, level = 0 }: NestedDirectoryViewProps) {
  // 最大嵌套层级限制，防止无限递归
  const maxLevel = 10;
  
  if (level >= maxLevel) {
    return (
      <div className="bg-yellow-100 dark:bg-yellow-900 p-4 border border-yellow-300 dark:border-yellow-700 rounded-lg">
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          目录嵌套层级过深，已显示前 {maxLevel} 层
        </p>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          暂无内容
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${level > 0 ? 'ml-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700' : ''}`}>
      {items.map((item, index) => {
        if (item.type === 'file') {
          const file = item as UnifiedFile;
          return (
            <div key={`file-${index}-${file.name}`} className="flex justify-between items-center bg-white dark:bg-gray-800 shadow-sm p-3 rounded-lg">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {file.name}
                </h4>
                {file.version && (
                  <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
                    版本: {file.version}
                  </p>
                )}
                {file.arch && file.arch !== 'all' && (
                  <p className="mt-1 text-gray-400 dark:text-gray-500 text-xs">
                    架构: {file.arch}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 ml-4">
                <DownloadButton
                  name="下载"
                  downloadLink={file.download_link}
                />
              </div>
            </div>
          );
        } else if (item.type === 'directory') {
          const directory = item as UnifiedDirectory;
          return (
            <div key={`dir-${index}-${directory.name}`} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <svg 
                  className="flex-shrink-0 mr-2 w-5 h-5 text-gray-500 dark:text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
                  />
                </svg>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  {directory.name}
                </h3>
                {directory.version && (
                  <span className="bg-blue-100 dark:bg-blue-900 ml-2 px-2 py-1 rounded-full text-blue-800 dark:text-blue-200 text-xs">
                    v{directory.version}
                  </span>
                )}
              </div>
              
              {directory.children && directory.children.length > 0 ? (
                <NestedDirectoryView 
                  items={directory.children} 
                  level={level + 1}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 p-3 rounded text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    此目录为空
                  </p>
                </div>
              )}
            </div>
          );
        }
        
        return null;
      })}
    </div>
  );
}