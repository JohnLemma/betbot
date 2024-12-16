import React from 'react';
import { Player } from '../types/game';

interface PlayerListProps {
  players: Player[];
}

export function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 w-64">
      <h2 className="text-xl font-bold mb-4">Players ({players.length})</h2>
      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={`p-3 rounded-lg ${
              player.isBot ? 'bg-gray-50' : 'bg-blue-50'
            }`}
          >
            <div className="font-semibold">{player.name}</div>
            <div className="text-sm text-gray-600">
              Numbers: {player.selectedNumbers.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}