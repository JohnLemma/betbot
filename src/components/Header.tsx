import React from 'react';
import { Wallet } from 'lucide-react';

interface HeaderProps {
  balance: number;
  onDeposit: () => void;
}

export function Header({ balance, onDeposit }: HeaderProps) {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Wallet className="w-5 h-5 text-blue-500 mr-2" />
          <span className="font-semibold">Balance: {balance} Birr</span>
        </div>
      </div>
      <button
        onClick={onDeposit}
        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
      >
        Deposit
      </button>
    </div>
  );
}