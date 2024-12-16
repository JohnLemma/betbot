import React from 'react';
import { Wallet, Users } from 'lucide-react';
import { GameTimer } from './GameTimer';

interface TopBarProps {
  balance: number;
  onDeposit: () => void;
  timeRemaining: number;
  totalPlayers: number;
}

export function TopBar({ balance, onDeposit, timeRemaining, totalPlayers }: TopBarProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm mb-2">
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <Wallet className="w-5 h-5 text-blue-500 mr-2" />
          <span className="font-semibold">{balance} Birr</span>
        </div>
        <button
          onClick={onDeposit}
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
        >
          Deposit
        </button>
        <div className="flex items-center space-x-4">
          <GameTimer timeRemaining={timeRemaining} />
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-bold">{totalPlayers}</span>
          </div>
        </div>
      </div>
    </div>
  );
}