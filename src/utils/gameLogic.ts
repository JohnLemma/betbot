import { Player, GameResults } from '../types/game';

export const TOTAL_NUMBERS = 54;
export const NUMBERS_TO_SELECT = 5;
export const ROUND_DURATION = 20; // seconds
export const ENTRY_FEE = 10; // birr

export function generateRandomNumbers(count: number, max: number): number[] {
  const numbers: number[] = [];
  while (numbers.length < count) {
    const num = Math.floor(Math.random() * max) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }
  return numbers.sort((a, b) => a - b);
}

export function calculateMatches(playerNumbers: number[], drawnNumbers: number[]): number {
  return playerNumbers.filter(num => drawnNumbers.includes(num)).length;
}

export function determineWinners(players: Player[], drawnNumbers: number[]): GameResults {
  const playerMatches = players.map(player => ({
    player,
    matches: calculateMatches(player.selectedNumbers, drawnNumbers),
  }));

  const maxMatches = Math.max(...playerMatches.map(pm => pm.matches));
  const winners = playerMatches
    .filter(pm => pm.matches === maxMatches)
    .map(pm => pm.player);

  const totalPrize = players.length * ENTRY_FEE;
  const prizePerWinner = winners.length > 0 ? totalPrize / winners.length : 0;

  return {
    winners,
    matchedNumbers: maxMatches,
    prize: prizePerWinner,
  };
}

export function createBotPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `bot-${i + 1}`,
    name: `User ${i + 1}`,
    selectedNumbers: generateRandomNumbers(NUMBERS_TO_SELECT, TOTAL_NUMBERS),
    isBot: true,
  }));
}