import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { LeftPanel } from './components/LeftPanel';
import { PrizePool } from './components/PrizePool';
import { NumberDraw } from './components/NumberDraw';
import { WinnerAnimation } from './components/WinnerAnimation';
import { StatsBar } from './components/StatsBar';
import { Player, GameState, GameResults } from './types/game';
import {
  ROUND_DURATION,
  ENTRY_FEE,
  generateRandomNumbers,
  determineWinners,
  createBotPlayers,
  NUMBERS_TO_SELECT,
  TOTAL_NUMBERS,
} from './utils/gameLogic';
import { NumberGrid } from './components/NumberGrid';
import { NumberHistory } from './components/NumberHistory';
import { WinningNumbers } from './components/WinningNumbers';

function App() {
  const [balance, setBalance] = useState(100);
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentRound: 0,
    drawnNumbers: [],
    timeRemaining: ROUND_DURATION,
    prizePool: 0,
    isGameActive: true,
  });
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [numberHistory, setNumberHistory] = useState<number[]>([]);
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [previousWinningNumbers, setPreviousWinningNumbers] = useState<number[]>([]);
  const [results, setResults] = useState<GameResults | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showWinnerAnimation, setShowWinnerAnimation] = useState(false);
  const [betRound, setBetRound] = useState<number | null>(null);
  const [showPreviousNumbers, setShowPreviousNumbers] = useState(true);

  useEffect(() => {
    const initializeGame = () => {
      const bots = createBotPlayers(37);
      setGameState(prev => ({
        ...prev,
        players: bots,
        prizePool: bots.length * ENTRY_FEE,
      }));
    };

    if (gameState.players.length === 0) {
      initializeGame();
    }

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 0) {
          return prev;
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gameState.timeRemaining === 0 && !isDrawing) {
      handleRoundEnd();
    }
  }, [gameState.timeRemaining]);

  const handleRoundEnd = async () => {
    setIsDrawing(true);
    setShowPreviousNumbers(false);
    const drawn = generateRandomNumbers(NUMBERS_TO_SELECT, TOTAL_NUMBERS);
    
    // Save current winning numbers as previous before clearing
    if (winningNumbers.length > 0) {
      setPreviousWinningNumbers(winningNumbers);
    }
    
    // Clear any previous numbers
    setGameState(prev => ({
      ...prev,
      drawnNumbers: [],
    }));
    setWinningNumbers([]);

    // First draw the numbers at the top with animation
    for (let i = 0; i < NUMBERS_TO_SELECT; i++) {
      setGameState(prev => ({
        ...prev,
        drawnNumbers: [...prev.drawnNumbers, drawn[i]],
      }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Wait for all animations to complete fully
    // Last number animation (0.8s) + text fade in (0.4s) + extra buffer (2.3s)
    await new Promise(resolve => setTimeout(resolve, 3500));

    // Calculate results and show everything after animations
    const roundResults = determineWinners(gameState.players, drawn);
    setResults(roundResults);
    setWinningNumbers(drawn);
    setShowPreviousNumbers(true);

    // Check if current player won
    const currentPlayer = gameState.players.find(p => !p.isBot);
    if (currentPlayer && roundResults.winners.includes(currentPlayer)) {
      setShowWinnerAnimation(true);
    }

    // Wait a bit before ending the round
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsDrawing(false);

    // Start new round with fresh bots
    const newBots = createBotPlayers(37);
    setGameState(prev => ({
      ...prev,
      drawnNumbers: drawn,
      currentRound: prev.currentRound + 1,
      timeRemaining: ROUND_DURATION,
      players: newBots,
      prizePool: newBots.length * ENTRY_FEE,
    }));
    
    setSelectedNumbers([]);
  };

  const handleNumberSelect = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(prev => prev.filter(n => n !== num));
    } else if (selectedNumbers.length < NUMBERS_TO_SELECT) {
      setSelectedNumbers(prev => [...prev, num]);
    }
  };

  const handleJoinGame = () => {
    if (selectedNumbers.length === NUMBERS_TO_SELECT && balance >= ENTRY_FEE) {
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: 'You',
        selectedNumbers,
        isBot: false,
      };

      setBalance(prev => prev - ENTRY_FEE);
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, newPlayer],
        prizePool: prev.prizePool + ENTRY_FEE,
      }));
      setNumberHistory(selectedNumbers);
      setBetRound(gameState.currentRound);
    }
  };

  const handleDeposit = () => {
    setBalance(prev => prev + 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <TopBar 
        balance={balance} 
        onDeposit={handleDeposit}
        timeRemaining={gameState.timeRemaining}
        totalPlayers={gameState.players.length}
      />
      
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-1">
          <PrizePool amount={gameState.prizePool} />
        </div>

        <div className="mb-4">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <NumberDraw
              drawnNumbers={gameState.drawnNumbers}
              isDrawing={isDrawing}
            />
            {showPreviousNumbers && previousWinningNumbers.length > 0 && (
              <div className="mt-2">
                <WinningNumbers 
                  numbers={previousWinningNumbers} 
                  matchedCount={
                    betRound === gameState.currentRound - 1 && numberHistory.length > 0
                      ? numberHistory.filter(num => previousWinningNumbers.includes(num)).length 
                      : undefined
                  }
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-3 mb-2">
          <NumberGrid
            selectedNumbers={selectedNumbers}
            onNumberSelect={handleNumberSelect}
            disabled={gameState.players.some(p => !p.isBot)}
          />
          
          {numberHistory.length > 0 && (
            <div className="mt-3">
              <NumberHistory numbers={numberHistory} />
            </div>
          )}
          
          <div className="mt-3 text-center">
            <button
              onClick={handleJoinGame}
              disabled={selectedNumbers.length !== 5 || gameState.players.some(p => !p.isBot)}
              className="bg-blue-500 text-white px-8 py-2 rounded-lg font-semibold disabled:opacity-50 hover:bg-blue-600 transition-colors"
            >
              Join Game ({ENTRY_FEE} Birr)
            </button>
          </div>
        </div>

        <div className="flex-1">
          <LeftPanel
            results={results}
          />
        </div>
      </div>

      <WinnerAnimation
        show={showWinnerAnimation}
        prize={results?.prize || 0}
        onClose={() => setShowWinnerAnimation(false)}
      />
    </div>
  );
}

export default App;