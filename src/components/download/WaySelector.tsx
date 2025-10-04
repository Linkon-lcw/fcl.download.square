import React from "react";
import { SelectorItem } from "@/types";

interface WaySelectorProps {
  ways: SelectorItem[];
  selectedWay: string;
  onWaySelect: (wayId: string) => void;
}

export default function WaySelector({ ways, selectedWay, onWaySelect }: WaySelectorProps) {
  return (
    <div className="w-full max-w-3xl">
      <h2 className="mb-4 font-semibold text-xl">选择下载线路</h2>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {ways.map((way) => (
          <button
            key={way.id}
            onClick={() => onWaySelect(way.id)}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedWay === way.id
                ? 'bg-[var(--primary)] text-white'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {way.name}
          </button>
        ))}
      </div>
    </div>
  );
}