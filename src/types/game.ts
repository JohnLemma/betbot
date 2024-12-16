export interface Player {
  id: string;
  name: string;
  selectedNumbers: number[];
  isBot: boolean;
}

export interface GameState {
  players: Player[];
  currentRound: number;
  drawnNumbers: number[];
  timeRemaining: number;
  prizePool: number;
  isGameActive: boolean;
}

export interface GameResults {
  winners: Player[];
  matchedNumbers: number;
  prize: number;
}