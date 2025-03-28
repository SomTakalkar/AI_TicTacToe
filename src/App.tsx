import React, { useState, useEffect } from 'react';
import { Gamepad2, Bot, RotateCcw, ArrowLeft } from 'lucide-react';
import Board from './components/Board';
import { checkWinner, findBestMove } from './utils/ai';

type Player = 'X' | 'O';
type GameMode = 'Friend' | 'AI' | null;

const App: React.FC = () => {
  const initialBoardState = Array(9).fill(null);

  const [board, setBoard] = useState<(string | null)[]>(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<string>('');
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [mode, setMode] = useState<GameMode>(null);
  const [isThinking, setIsThinking] = useState(false);

  const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  const checkGameWinner = (boardState: (string | null)[]): void => {
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        setGameStatus(`${boardState[a]} Wins!`);
        setWinningLine(condition);
        return;
      }
    }

    if (!boardState.includes(null)) {
      setGameStatus("It's a Draw!");
    }
  };

  const handleCellClick = async (index: number): Promise<void> => {
    if (board[index] || gameStatus || isThinking) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    setBoard(newBoard);
    checkGameWinner(newBoard);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    if (mode === 'AI' && !gameStatus) {
      setIsThinking(true);
      // Add a small delay to show the AI "thinking"
      await new Promise(resolve => setTimeout(resolve, 500));

      const aiMove = findBestMove(newBoard, 'O');
      if (aiMove !== -1) {
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);
        checkGameWinner(aiBoard);
        setCurrentPlayer('X');
      }
      setIsThinking(false);
    }
  };

  const resetGame = (): void => {
    setBoard(initialBoardState);
    setCurrentPlayer('X');
    setGameStatus('');
    setWinningLine([]);
    setIsThinking(false);
  };

  const selectMode = (selectedMode: GameMode): void => {
    setMode(selectedMode);
    resetGame();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Tic Tac Toe
        </h1>
        
        {!mode ? (
          <div className="space-y-4">
            <button
              onClick={() => selectMode('Friend')}
              className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Gamepad2 size={24} />
              Play with Friend
            </button>
            <button
              onClick={() => selectMode('AI')}
              className="w-full py-4 px-6 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors"
            >
              <Bot size={24} />
              Play with AI (Unbeatable)
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`relative ${isThinking ? 'opacity-50' : ''}`}>
              <Board
                board={board}
                onCellClick={handleCellClick}
                winningLine={winningLine}
              />
              {isThinking && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-lg font-semibold text-gray-700">
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                {gameStatus || `Current Player: ${currentPlayer}`}
              </h2>
              
              <div className="flex gap-3 justify-center">
                {gameStatus && (
                  <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                  >
                    <RotateCcw size={20} />
                    Restart
                  </button>
                )}
                <button
                  onClick={() => setMode(null)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft size={20} />
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;