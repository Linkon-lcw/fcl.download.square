import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import DownloadButton from "@/components/ui/DownloadButton";
import { DownloadWay } from "@/types";
import { UnifiedItem } from "@/services/downloadUtils";

interface TreeStructureViewProps {
  appName: string;
  wayName: string;
  data: DownloadWay;
  apiVersion?: number | null;
  processedData?: UnifiedItem[] | null;
}

export default function TreeStructureView({ appName, wayName, data, apiVersion, processedData }: TreeStructureViewProps) {
  // API 2.0 格式显示
  if (apiVersion === 2 && processedData) {
    return (
      <div className="w-full max-w-3xl">
        <h2 className="mb-2 font-semibold text-xl">
          {data.name || wayName}
        </h2>
        {data.description && (
          <div className="mb-4 text-gray-600 dark:text-gray-400 text-sm max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // 自定义代码块样式
                code({ node, inline, className, children, ...props }) {
                  return inline ? (
                    <code className="bg-gray-100 dark:bg-gray-800 text-red-600 dark:text-red-400 px-1 py-0.5 rounded text-sm font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto my-2">
                      <code className="text-sm font-mono" {...props}>
                        {children}
                      </code>
                    </pre>
                  );
                },
                // 自定义引用样式
                blockquote({ node, children, ...props }) {
                  return (
                    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-2 italic" {...props}>
                      {children}
                    </blockquote>
                  );
                },
                // 自定义列表样式
                ul({ node, children, ...props }) {
                  return (
                    <ul className="list-disc pl-5 my-2 space-y-1" {...props}>
                      {children}
                    </ul>
                  );
                },
                ol({ node, children, ...props }) {
                  return (
                    <ol className="list-decimal pl-5 my-2 space-y-1" {...props}>
                      {children}
                    </ol>
                  );
                },
                li({ node, children, ...props }) {
                  return (
                    <li className="pl-1" {...props}>
                      {children}
                    </li>
                  );
                },
                // 自定义表格样式
                table({ node, children, ...props }) {
                  return (
                    <div className="overflow-x-auto my-2">
                      <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600" {...props}>
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ node, children, ...props }) {
                  return (
                    <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-left font-semibold bg-gray-50 dark:bg-gray-800" {...props}>
                      {children}
                    </th>
                  );
                },
                td({ node, children, ...props }) {
                  return (
                    <td className="border border-gray-300 dark:border-gray-600 px-3 py-2" {...props}>
                      {children}
                    </td>
                  );
                },
                // 自定义链接样式
                a({ node, children, ...props }) {
                  return (
                    <a className="text-blue-600 dark:text-blue-400 hover:underline" {...props}>
                      {children}
                    </a>
                  );
                },
                // 自定义标题样式
                h1({ node, children, ...props }) {
                  return (
                    <h1 className="text-2xl font-bold mt-4 mb-2" {...props}>
                      {children}
                    </h1>
                  );
                },
                h2({ node, children, ...props }) {
                  return (
                    <h2 className="text-xl font-semibold mt-3 mb-2" {...props}>
                      {children}
                    </h2>
                  );
                },
                h3({ node, children, ...props }) {
                  return (
                    <h3 className="text-lg font-medium mt-2 mb-1" {...props}>
                      {children}
                    </h3>
                  );
                },
                // 自定义段落样式
                p({ node, children, ...props }) {
                  return (
                    <p className="mb-2" {...props}>
                      {children}
                    </p>
                  );
                },
                // 自定义水平分割线样式
                hr({ node, ...props }) {
                  return (
                    <hr className="my-4 border-gray-300 dark:border-gray-600" {...props} />
                  );
                }
              }}
            >
              {data.description}
            </ReactMarkdown>
          </div>
        )}
        <div className="space-y-6">
          {processedData.map((version) => (
            <div key={version.name} className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg">
              <h3 className="mb-1 font-semibold text-lg">
                {version.name}
              </h3>
              {version.version && (
                <p className="mb-4 text-gray-600 dark:text-gray-400 text-sm">
                  版本: {version.version}
                </p>
              )}
              {version.type === 'directory' && version.children && (
                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {version.children.map((file, index) => (
                    <DownloadButton
                      key={`${version.name}-${file.name}-${index}`}
                      name={file.arch || file.name || '下载'}
                      downloadLink={file.download_link}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // API 1.0 格式显示（默认）
  return (
    <div className="w-full max-w-3xl">
      <h2 className="mb-4 font-semibold text-xl">
        {appName} - {wayName}
      </h2>
      <div className="space-y-6">
        {data.children.map((version) => (
          <div key={version.name} className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg">
            <h3 className="mb-4 font-semibold text-lg">
              {version.name} {version.name === data.latest && (
                <span className="bg-green-500 ml-2 px-2 py-1 rounded-full text-white text-xs">
                  最新
                </span>
              )}
            </h3>
            <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {version.children.map((file, index) => (
                <DownloadButton
                  key={`${version.name}-${file.arch}-${index}`}
                  name={file.arch}
                  downloadLink={file.download_link}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}