import React, { useState, useEffect } from 'react';
import { Gamepad2, Bot, RotateCcw, ArrowLeft, Grid3x3, Grid, Info } from 'lucide-react';
import Board from './components/Board';
import { checkWinner, findBestMove, countThreeInARow } from './utils/ai';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

type Player = 'X' | 'O';
type GameMode = 'Friend' | 'AI' | null;
type GridSize = '3x3' | '5x5';

const App: React.FC = () => {
  const [gridSize, setGridSize] = useState<GridSize>('3x3');
  const initialBoardState = Array(gridSize === '3x3' ? 9 : 25).fill(null);

  const [board, setBoard] = useState<(string | null)[]>(initialBoardState);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameStatus, setGameStatus] = useState<string>('');
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [mode, setMode] = useState<GameMode>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    socket.on('updateGame', (data: any) => {
      setBoard(data.board);
      setCurrentPlayer(data.currentPlayer);
      setScores(data.scores);
    });

    return () => {
      socket.off('updateGame');
    };
  }, []);

  const checkGameWinner = (boardState: (string | null)[]): void => {
    if (gridSize === '3x3') {
      const winner = checkWinner(boardState);
      if (winner) {
        setGameStatus(`${winner} Wins!`);
        setScores(prev => ({ ...prev, [winner]: prev[winner as keyof typeof prev] + 1 }));
        return;
      }
    } else {
      const { playerX, playerO } = countThreeInARow(boardState);
      if (!boardState.includes(null) || boardState.filter(cell => cell === null).length === 1) {
        const winner = playerX > playerO ? 'X' : playerO > playerX ? 'O' : 'Draw';
        setGameStatus(winner === 'Draw' ? "It's a Draw!" : `${winner} Wins! (${playerX}-${playerO})`);
        if (winner !== 'Draw') {
          setScores(prev => ({ ...prev, [winner]: prev[winner as keyof typeof prev] + 1 }));
        }
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

    if (mode === 'Friend') {
      socket.emit('playerMove', {
        board: newBoard,
        currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
        scores
      });
    }

    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    if (mode === 'AI' && !gameStatus) {
      setIsThinking(true);
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
    setBoard(Array(gridSize === '3x3' ? 9 : 25).fill(null));
    setCurrentPlayer('X');
    setGameStatus('');
    setWinningLine([]);
    setIsThinking(false);
  };

  const resetScores = (): void => {
    setScores({ X: 0, O: 0 });
  };

  const selectMode = (selectedMode: GameMode): void => {
    setMode(selectedMode);
    resetGame();
    resetScores();
  };

  const handleGridSizeChange = (size: GridSize): void => {
    setGridSize(size);
    setMode(null);
    resetGame();
    resetScores();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Tic Tac Toe</h1>
          <button
            onClick={() => setShowRules(!showRules)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Game Rules"
          >
            <Info size={24} className="text-gray-600" />
          </button>
        </div>

        {showRules && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">Game Rules</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">3x3 Mode:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Classic Tic Tac Toe rules apply</li>
                  <li>Get three in a row horizontally, vertically, or diagonally to win</li>
                  <li>First player to achieve this wins the round</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">5x5 Mode:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Players score points by creating three-in-a-row sequences</li>
                  <li>Multiple three-in-a-row sequences can be formed</li>
                  <li>Game ends when all but one square is filled</li>
                  <li>Player with the most three-in-a-row sequences wins</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Scoring:</h3>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Win a round to earn a point</li>
                  <li>Scores persist until manually reset</li>
                  <li>Use 'Reset Scores' to start fresh</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {!mode ? (
          <div className="space-y-4">
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => handleGridSizeChange('3x3')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  gridSize === '3x3' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                } transition-colors`}
              >
                <Grid3x3 size={20} />
                3x3
              </button>
              <button
                onClick={() => handleGridSizeChange('5x5')}
                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
                  gridSize === '5x5' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                } transition-colors`}
              >
                <Grid size={20} />
                5x5
              </button>
            </div>
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
              Play with AI
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-semibold">
                Player X: <span className="text-blue-600">{scores.X}</span>
              </div>
              <div className="text-lg font-semibold">
                Player O: <span className="text-red-600">{scores.O}</span>
              </div>
            </div>
            
            <div className={`relative ${isThinking ? 'opacity-50' : ''}`}>
              <Board
                board={board}
                onCellClick={handleCellClick}
                winningLine={winningLine}
                gridSize={gridSize}
              />
              {isThinking && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-lg font-semibold text-gray-700 bg-white/80 px-4 py-2 rounded-lg">
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700">
                {gameStatus || `Current Player: ${currentPlayer}`}
              </h2>
              
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <RotateCcw size={20} />
                  New Game
                </button>
                <button
                  onClick={resetScores}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg flex items-center gap-2 hover:bg-yellow-700 transition-colors"
                >
                  <RotateCcw size={20} />
                  Reset Scores
                </button>
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
