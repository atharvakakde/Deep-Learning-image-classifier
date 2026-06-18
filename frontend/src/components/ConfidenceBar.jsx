import React from 'react';

export default function ConfidenceBar({ confidence }) {
  const percent = Math.round(confidence * 100);
  const getColor = () => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  return (
    <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
      <div
        className={`h-4 ${getColor()} transition-all duration-500`}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
