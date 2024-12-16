import React from 'react';
import { GameResults } from '../types/game';

interface LastRoundResultsProps {
  results: GameResults | null;
}

export function LastRoundResults({ results }: LastRoundResultsProps) {
  if (!results) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-bold mb-2">Last Round Results</h3>
      <div className="space-y-1">
        <p className="text-sm">Matched Numbers: {results.matchedNumbers}</p>
        <p className="text-sm">Winners: {results.winners.map(w => w.name).join(', ')}</p>
        <p className="text-sm font-semibold">Prize per Winner: {results.prize} Birr</p>
      </div>
    </div>
  );
}