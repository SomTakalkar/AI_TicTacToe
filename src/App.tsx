import React, { useState } from 'react';
import { Bot, RotateCcw, ArrowLeft, Info, Lock, Unlock } from 'lucide-react';
import ThreeBoard from './components/3d/ThreeBoard';
import { useGameLogic, GameMode } from './hooks/useGameLogic';

const App: React.FC = () => {
  const [mode, setMode] = useState<GameMode>(null);
  const [showRules, setShowRules] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(true);

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
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 selection:bg-neon-blue selection:text-black">

      {/* Title */}
      <div className="mb-8 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple drop-shadow-[0_0_10px_rgba(0,243,255,0.5)] tracking-wider">
          TIC TAC TOE
        </h1>
        <div className="text-xl md:text-2xl font-rajdhani font-bold text-neon-blue tracking-[0.5em] mt-2 uppercase opacity-80">
          - Dashboard -
        </div>
        <div className="h-[2px] w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-neon-purple to-transparent mt-4 opacity-50 shadow-[0_0_10px_#bc13fe]"></div>
      </div>

      {mode ? (
        /* GAME MODE */
        <div className="w-full max-w-4xl relative z-10 animate-fade-in">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6 px-4">
            <button
              onClick={() => { setMode(null); resetGame(); }}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:border-neon-blue/50 backdrop-blur-md transition-all duration-300"
            >
              <ArrowLeft size={20} className="text-slate-400 group-hover:text-neon-blue transition-colors" />
              <span className="font-rajdhani font-semibold text-slate-400 group-hover:text-neon-blue tracking-wide uppercase text-sm">Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="px-6 py-2 rounded-full border border-neon-blue/20 bg-slate-900/60 backdrop-blur shadow-[0_0_15px_rgba(0,243,255,0.1)]">
                <div className="font-orbitron text-neon-blue text-lg tracking-widest">
                  {isThinking ? "AI THINKING..." : (gameStatus || `${currentPlayer === 'X' ? 'YOUR' : "AI"} TURN`)}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowRules(!showRules)}
              className="p-3 rounded-xl bg-slate-900/40 border border-slate-700/50 hover:border-neon-purple/50 backdrop-blur-md transition-all text-slate-400 hover:text-neon-purple"
            >
              <Info size={20} />
            </button>
          </div>

          {/* 3D Board Container */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/50 bg-slate-900/20 backdrop-blur-sm shadow-2xl">
            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neon-blue rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neon-blue rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-neon-blue rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-neon-blue rounded-br-xl"></div>

            <ThreeBoard
              board={board}
              onCellClick={handleCellClick}
              winningLines={winningLines}
              gridSize={'3x3'}
              rotationEnabled={rotationEnabled}
            />

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-neon-blue/10 hover:bg-neon-blue/20 border border-neon-blue/50 rounded-full text-neon-blue font-orbitron font-bold tracking-wider hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all flex items-center gap-2"
              >
                <RotateCcw size={18} /> RESTART SYSTEM
              </button>

              <button
                onClick={() => setRotationEnabled(!rotationEnabled)}
                className={`px-6 py-3 border rounded-full font-orbitron font-bold tracking-wider transition-all flex items-center gap-2 ${rotationEnabled
                  ? 'bg-neon-purple/10 hover:bg-neon-purple/20 border-neon-purple/50 text-neon-purple hover:shadow-[0_0_20px_rgba(188,19,254,0.3)]'
                  : 'bg-slate-800/50 hover:bg-slate-800 border-slate-600 text-slate-400'
                  }`}
              >
                {rotationEnabled ? <Unlock size={18} /> : <Lock size={18} />}
                {rotationEnabled ? 'ROTATION: ON' : 'ROTATION: LOCKED'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* DASHBOARD MODE */
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-8">
          {/* Decorative circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-slate-800/30 rounded-full pointer-events-none animate-spin-slow"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-neon-blue/5 rounded-full pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">

            {/* AI Score Card */}
            <div className="relative group w-64 h-40">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-neon-blue/30 shadow-[0_0_30px_rgba(0,243,255,0.1)] group-hover:border-neon-blue/60 group-hover:shadow-[0_0_40px_rgba(0,243,255,0.2)] transition-all duration-500"></div>
              {/* Neon Rims */}
              <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent"></div>
              <div className="absolute inset-x-8 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-neon-blue to-transparent"></div>

              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                <span className="font-rajdhani font-bold text-neon-blue/80 text-sm tracking-wider uppercase mb-2">AI Last Game Points</span>
                <span className="font-orbitron font-black text-6xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {scores.O}
                </span>
              </div>
            </div>

            {/* Start Button */}
            <div className="relative group">
              <button
                onClick={() => { setMode('AI'); resetGame(); }}
                className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-2xl group-active:scale-95 transition-all duration-200"
              >
                {/* Glowing Ring */}
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-neon-green border-r-neon-green/50 rotate-45 group-hover:rotate-180 transition-transform duration-700"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-neon-green border-l-neon-green/50 -rotate-45 group-hover:-rotate-180 transition-transform duration-700"></div>

                {/* Inner Glow */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-neon-green/20 to-transparent blur-md group-hover:from-neon-green/30 transition-all"></div>

                {/* Play Icon */}
                <div className="w-16 h-16 ml-2 bg-gradient-to-br from-white to-slate-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(10,255,0,0.4)] mb-2">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-slate-900 border-b-[12px] border-b-transparent ml-1"></div>
                </div>
                <span className="font-orbitron font-bold text-2xl text-white tracking-widest drop-shadow-md">START</span>
                <span className="font-rajdhani font-semibold text-neon-green text-sm tracking-[0.2em] mt-1">GAME</span>
              </button>
            </div>

            {/* Player Score Card */}
            <div className="relative group w-64 h-40">
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-neon-purple/30 shadow-[0_0_30px_rgba(188,19,254,0.1)] group-hover:border-neon-purple/60 group-hover:shadow-[0_0_40px_rgba(188,19,254,0.2)] transition-all duration-500"></div>
              {/* Neon Rims */}
              <div className="absolute inset-x-8 top-0 h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>
              <div className="absolute inset-x-8 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-neon-purple to-transparent"></div>

              <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
                <span className="font-rajdhani font-bold text-neon-purple/80 text-sm tracking-wider uppercase mb-2">Player Last Game Points</span>
                <span className="font-orbitron font-black text-6xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                  {scores.X}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Rules Hint */}
          <div className="mt-16 text-center">
            <button onClick={() => setShowRules(true)} className="font-rajdhani text-slate-500 hover:text-neon-blue transition-colors tracking-widest text-sm uppercase">
              View Mission Directives // Rules
            </button>
          </div>
        </div>
      )}

      {/* Rules Modal Overlay */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 p-8 rounded-2xl relative shadow-[0_0_50px_rgba(0,243,255,0.15)]">
            <button onClick={() => setShowRules(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              ✕
            </button>
            <h2 className="text-2xl font-orbitron font-bold text-neon-blue mb-4">HOW TO PLAY</h2>
            <ul className="space-y-3 font-rajdhani text-lg text-slate-300">
              <li className="flex items-start gap-3">
                <span className="text-neon-purple">►</span>
                <span><strong>Grid:</strong> Classic 3x3 layout.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-purple">►</span>
                <span><strong>Win Condition:</strong> Link 3 symbols closely to triumph.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-red">►</span>
                <span><strong>Infinite Protocol:</strong> Only 3 units allowed per side. Placing a 4th unit destroys your oldest one.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
