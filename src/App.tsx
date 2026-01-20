import React, { useState } from 'react';
import { Bot, RotateCcw, ArrowLeft, Info } from 'lucide-react';
import ThreeBoard from './components/3d/ThreeBoard';
import { useGameLogic, GameMode } from './hooks/useGameLogic';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(null);
  const [showRules, setShowRules] = useState(false);

  const {
    board,
    currentPlayer,
    gameStatus,
    winningLines,
    scores,
    isThinking,
    makeMove,
    handleAIMove,
    resetGame,
    resetScores
  } = useGameLogic(mode);

  const handleCellClick = async (index: number) => {
    const result = await makeMove(index);
    if (!result) return;

    if (mode === 'AI') {
      const { newBoard } = result;
      // Pass the new board state to AI
      await handleAIMove(newBoard);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-100">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
            INFINITE TIC TAC TOE 3D
          </h1>
          <p className="text-slate-400">Classic game with a twist: Only 3 moves allowed!</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl">

          {/* Top Bar: Back, Rules */}
          <div className="flex justify-between items-start mb-6">
            {mode && (
              <button onClick={() => { setMode(null); resetGame(); }} className="p-2 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-sm text-slate-400">
                <ArrowLeft size={20} /> Back
              </button>
            )}

            <div className="flex-1"></div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowRules(!showRules)}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400"
                title="Game Rules"
              >
                <Info size={24} />
              </button>
            </div>
          </div>

          {/* Rules Modal/Section */}
          {showRules && (
            <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-sm text-slate-300">
              <h2 className="text-lg font-semibold text-white mb-2">How to Play</h2>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Infinite Rules:</strong> You can only have 3 pieces on the board.</li>
                <li><strong>4th Move:</strong> Placing a 4th piece removes your 1st piece!</li>
                <li><strong>Objective:</strong> Connect 3 symbols to win.</li>
                <li><strong>Controls:</strong> Drag to rotate the 3D board.</li>
              </ul>
            </div>
          )}

          {!mode ? (
            /* MENU MODE */
            <div className="space-y-8 max-w-md mx-auto">
              {/* Game Modes */}
              <div className="grid gap-4">
                <button
                  onClick={() => { setMode('AI'); resetGame(); }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl flex items-center justify-center gap-3 font-semibold text-lg transition-all shadow-lg shadow-emerald-900/20"
                >
                  <Bot size={24} /> Play vs AI
                </button>
              </div>
            </div>
          ) : (
            /* GAME MODE */
            <div className="space-y-6">
              {/* Score Board */}
              <div className="flex justify-between items-center px-6 py-3 bg-slate-800 rounded-xl border border-slate-700">
                <div className={`flex items-center gap-3 ${currentPlayer === 'X' ? 'opacity-100 scale-105' : 'opacity-60'} transition-all`}>
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                  <span className="font-bold text-xl">Player X (You)</span>
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-blue-400 font-mono">{scores.X}</span>
                </div>
                <div className={`flex items-center gap-3 ${currentPlayer === 'O' ? 'opacity-100 scale-105' : 'opacity-60'} transition-all`}>
                  <span className="bg-slate-900 px-2 py-0.5 rounded text-red-500 font-mono">{scores.O}</span>
                  <span className="font-bold text-xl">AI (O)</span>
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
              </div>

              {/* Status Message */}
              <div className="text-center h-8">
                {gameStatus ? (
                  <span className="text-xl font-bold text-yellow-400 animate-pulse">{gameStatus}</span>
                ) : (
                  <span className="text-slate-400">
                    {isThinking ? "AI is thinking..." : `${currentPlayer === 'X' ? 'Your' : "AI's"} Turn`}
                  </span>
                )}
              </div>

              {/* 3D Board */}
              <ThreeBoard
                board={board}
                onCellClick={handleCellClick}
                winningLines={winningLines}
                gridSize={'3x3'}
              />

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-2 transition-colors font-semibold"
                >
                  <RotateCcw size={18} /> Restart
                </button>
                <button
                  onClick={resetScores}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
                >
                  Reset Scores
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
