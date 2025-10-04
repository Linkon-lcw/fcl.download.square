import React from "react";
import DownloadButton from "@/components/ui/DownloadButton";
import { SoftwareConfigFile } from "@/types";

interface SimpleListViewProps {
  appName: string;
  wayName: string;
  data: SoftwareConfigFile[];
}

export default function SimpleListView({ appName, wayName, data }: SimpleListViewProps) {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="mb-4 font-semibold text-xl">
        {appName} - {wayName}
      </h2>
      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((file, index) => (
          <DownloadButton
            key={`${file.name}-${index}`}
            name={file.name}
            downloadLink={file.url}
          />
        ))}
      </div>
    </div>
  );
}