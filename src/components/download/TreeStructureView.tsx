import React from "react";
import DownloadButton from "@/components/ui/DownloadButton";
import { DownloadWay } from "@/types";

interface TreeStructureViewProps {
  appName: string;
  wayName: string;
  data: DownloadWay;
}

export default function TreeStructureView({ appName, wayName, data }: TreeStructureViewProps) {
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