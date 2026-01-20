import { useState, useCallback } from 'react';
import { checkWinner, findBestMove } from '../utils/ai';

export type Player = 'X' | 'O';
export type GameMode = 'AI' | null;

interface GameState {
    board: (string | null)[];
    currentPlayer: Player;
    gameStatus: string;
    winningLines: number[][];
    scores: { X: number; O: number };
    isThinking: boolean;
}

export const useGameLogic = (mode: GameMode) => {
    const initialBoardState = Array(9).fill(null);

    const [board, setBoard] = useState<(string | null)[]>(initialBoardState);
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    // Track move history for Infinite Tic-Tac-Toe (Index FIFO)
    const [playerMoves, setPlayerMoves] = useState<{ X: number[], O: number[] }>({ X: [], O: [] });

    const [gameStatus, setGameStatus] = useState<string>('');
    const [winningLines, setWinningLines] = useState<number[][]>([]);
    const [scores, setScores] = useState({ X: 0, O: 0 });
    const [isThinking, setIsThinking] = useState(false);

    const checkGameWinner = useCallback((boardState: (string | null)[]) => {
        const { winner, line } = checkWinner(boardState);
        if (winner) {
            setWinningLines([line]);
            setGameStatus(`${winner} Wins!`);
            setScores(prev => ({ ...prev, [winner]: prev[winner as keyof typeof prev] + 1 }));
            return true; // Return true if game ended
        }
        setWinningLines([]);
        return false;
    }, []);

    const makeMove = async (index: number) => {
        if (board[index] || gameStatus || isThinking) return;

        const newBoard = [...board];
        const newPlayerMoves = { ...playerMoves };
        const currentMoves = newPlayerMoves[currentPlayer];

        // Infinite Logic: If player has 3 moves, verify removal
        if (currentMoves.length >= 3) {
            const moveToRemove = currentMoves.shift(); // Remove oldest
            if (moveToRemove !== undefined) {
                newBoard[moveToRemove] = null;
            }
        }

        // Add new move
        currentMoves.push(index);
        newBoard[index] = currentPlayer; // Place new piece

        setPlayerMoves(newPlayerMoves);
        setBoard(newBoard);

        const gameEnded = checkGameWinner(newBoard);
        if (gameEnded) return;

        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);

        return { newBoard, nextPlayer };
    };

    const handleAIMove = async (currentBoard: (string | null)[]) => {
        setIsThinking(true);
        // Artificial delay for realism
        await new Promise(resolve => setTimeout(resolve, 500));

        // Note: findBestMove logic assumes standard Tic-Tac-Toe.
        // It might not play optimally for Infinite Tic-Tac-Toe (it won't anticipate its own piece disappearing),
        // but it will play legal moves based on the current board state.

        const aiMove = findBestMove(currentBoard, 'O');

        if (aiMove !== -1) {
            const aiBoard = [...currentBoard];
            const newPlayerMoves = { ...playerMoves };
            const aiMoves = newPlayerMoves['O'];

            if (aiMoves.length >= 3) {
                const moveToRemove = aiMoves.shift();
                if (moveToRemove !== undefined) {
                    aiBoard[moveToRemove] = null;
                }
            }
            aiMoves.push(aiMove);
            aiBoard[aiMove] = 'O';

            setPlayerMoves(newPlayerMoves);
            setBoard(aiBoard);
            checkGameWinner(aiBoard);
            setCurrentPlayer('X');
        }
        setIsThinking(false);
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setPlayerMoves({ X: [], O: [] });
        setCurrentPlayer('X');
        setGameStatus('');
        setWinningLines([]);
        setIsThinking(false);
    };

    const resetScores = () => setScores({ X: 0, O: 0 });

    return {
        board,
        setBoard,
        currentPlayer,
        setCurrentPlayer,
        gameStatus,
        winningLines,
        scores,
        setScores,
        isThinking,
        makeMove,
        handleAIMove,
        resetGame,
        resetScores
    };
};
