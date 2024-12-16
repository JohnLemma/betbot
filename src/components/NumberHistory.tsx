import React from 'react';

interface NumberHistoryProps {
  numbers: number[];
}

export function NumberHistory({ numbers }: NumberHistoryProps) {
  if (numbers.length === 0) return null;

  return (
    <div className="flex justify-center space-x-2">
      {numbers.map((num, index) => (
        <div
          key={`${num}-${index}`}
          className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-500 text-white"
        >
          {num}
        </div>
      ))}
    </div>
  );
} 