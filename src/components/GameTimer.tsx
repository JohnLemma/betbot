import React from 'react';

interface GameTimerProps {
  timeRemaining: number;
}

export function GameTimer({ timeRemaining }: GameTimerProps) {
  return (
    <div className="flex items-center bg-blue-50 px-4 py-2 rounded-lg">
      <div className="text-lg font-bold text-blue-600">{timeRemaining}s</div>
    </div>
  );
}