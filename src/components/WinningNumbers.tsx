import React from 'react';

interface WinningNumbersProps {
  numbers: number[];
  matchedCount?: number;
}

export function WinningNumbers({ numbers, matchedCount }: WinningNumbersProps) {
  if (numbers.length === 0) return null;

  return (
    <div className="flex justify-center items-center space-x-4">
      <div className="flex justify-center space-x-2">
        {numbers.map((num, index) => (
          <div
            key={`${num}-${index}`}
            className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold bg-green-500 text-white"
          >
            {num}
          </div>
        ))}
      </div>
      {matchedCount !== undefined && (
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold bg-yellow-500 text-white">
          {matchedCount}
        </div>
      )}
    </div>
  );
} 