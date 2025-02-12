import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = (current / total) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span className="font-medium">Question {current} of {total}</span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-[#B91C1C] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
