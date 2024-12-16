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
    // Initial fetch
    fetchGameState();

    // Set up polling every second for more responsive updates
    const interval = setInterval(() => {
      fetchGameState();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchGameState = async () => {
    try {
      const response = await fetch('/api/game?path=get-game-state');
      const data = await response.json();
      
      if (data.status === 'success') {
        const { currentRound, previousRound } = data;
        
        // Update game state
        setGameState(prev => ({
          ...prev,
          currentRound: currentRound?.id || 0,
          timeRemaining: 60, // 1 minute rounds
          prizePool: currentRound?.prize_pool || 0,
          drawnNumbers: previousRound?.drawn_numbers || [],
          isGameActive: true
        }));

        // Update previous winning numbers if available
        if (previousRound?.drawn_numbers) {
          setPreviousWinningNumbers(previousRound.drawn_numbers);
        }

        // If we have new drawn numbers and we're not currently drawing
        if (previousRound?.drawn_numbers && !isDrawing) {
          handleNewDrawnNumbers(previousRound.drawn_numbers);
        }
      }
    } catch (error) {
      console.error('Error fetching game state:', error);
    }
  };

  const handleNewDrawnNumbers = async (numbers: number[]) => {
    setIsDrawing(true);
    setShowPreviousNumbers(false);

    // Clear any previous numbers
    setGameState(prev => ({
      ...prev,
      drawnNumbers: [],
    }));
    setWinningNumbers([]);

    // Animate drawing each number
    for (let i = 0; i < numbers.length; i++) {
      setGameState(prev => ({
        ...prev,
        drawnNumbers: [...prev.drawnNumbers, numbers[i]],
      }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Update final state
    setWinningNumbers(numbers);
    setShowPreviousNumbers(true);
    setIsDrawing(false);
  };

  const handleJoinGame = async () => {
    if (selectedNumbers.length === NUMBERS_TO_SELECT && balance >= ENTRY_FEE) {
      try {
        const response = await fetch('/api/game', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: 'place-bet',
            body: {
              telegramId: 'test-user', // Replace with actual user ID
              numbers: selectedNumbers,
            },
          }),
        });

        const data = await response.json();
        if (data.status === 'success') {
          setBalance(prev => prev - ENTRY_FEE);
          setNumberHistory(selectedNumbers);
          setBetRound(gameState.currentRound);
        }
      } catch (error) {
        console.error('Error placing bet:', error);
      }
    }
  };

  const handleNumberSelect = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(prev => prev.filter(n => n !== num));
    } else if (selectedNumbers.length < NUMBERS_TO_SELECT) {
      setSelectedNumbers(prev => [...prev, num]);
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
