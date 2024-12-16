import React from 'react';

interface PrizePoolProps {
  amount: number;
}

export function PrizePool({ amount }: PrizePoolProps) {
  return (
    <div className="text-center py-1">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl p-3 shadow-lg">
        <div className="text-3xl font-bold">{amount} Birr</div>
      </div>
    </div>
  );
}