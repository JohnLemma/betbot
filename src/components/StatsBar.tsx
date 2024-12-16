import React from 'react';
import { Users } from 'lucide-react';

interface StatsBarProps {
  totalPlayers: number;
}

export function StatsBar({ totalPlayers }: StatsBarProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="flex justify-center">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Total Players</p>
            <p className="font-bold">{totalPlayers}</p>
          </div>
        </div>
      </div>
    </div>
  );
}