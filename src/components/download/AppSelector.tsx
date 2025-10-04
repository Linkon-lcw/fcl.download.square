import React from "react";
import { SelectorItem } from "@/types";

interface AppSelectorProps {
  apps: SelectorItem[];
  selectedApp: string;
  onAppSelect: (appId: string) => void;
}

export default function AppSelector({ apps, selectedApp, onAppSelect }: AppSelectorProps) {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="mb-4 font-semibold text-xl">选择应用</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onAppSelect(app.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedApp === app.id
                ? 'bg-[var(--primary)] text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {app.name}
          </button>
        ))}
      </div>
    </div>
  );
}