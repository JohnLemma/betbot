import React from 'react';

interface NumberGridProps {
  selectedNumbers: number[];
  onNumberSelect: (num: number) => void;
  disabled: boolean;
}

export function NumberGrid({ selectedNumbers, onNumberSelect, disabled }: NumberGridProps) {
  return (
    <div className="grid grid-cols-9 gap-3">
      {Array.from({ length: 54 }, (_, i) => i + 1).map((num) => (
        <button
          key={num}
          onClick={() => onNumberSelect(num)}
          disabled={disabled || (selectedNumbers.length >= 5 && !selectedNumbers.includes(num))}
          className={`
            aspect-square w-full rounded-full flex items-center justify-center text-lg font-bold
            ${selectedNumbers.includes(num)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {num}
        </button>
      ))}
    </div>
  );
}