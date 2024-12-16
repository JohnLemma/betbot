export interface Player {
  id: string;
  name: string;
  selectedNumbers: number[];
  isBot: boolean;
}

export interface GameState {
  currentRound: number;
  drawnNumbers: number[];
  timeRemaining: number;
  prizePool: number;
  isGameActive: boolean;
}

export interface GameResults {
  winners: Player[];
  prize: number;
}

export interface Round {
  id: number;
  status: 'active' | 'completed';
  start_time: string;
  end_time?: string;
  prize_pool: number;
  drawn_numbers?: number[];
}

export interface Bet {
  id: number;
  telegram_id: string;
  round_id: number;
  numbers: number[];
  status: 'pending' | 'won' | 'lost';
  prize: number;
  created_at: string;
}
