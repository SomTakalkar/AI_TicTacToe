type Player = 'X' | 'O';
type Board = (Player | null)[];

const WIN_CONDITIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const checkWinner = (board: Board): Player | null => {
  for (const [a, b, c] of WIN_CONDITIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const isDraw = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  player: Player
): number => {
  const opponent: Player = player === 'O' ? 'X' : 'O';
  const winner = checkWinner(board);

  // Base cases
  if (winner === player) return 10 - depth;
  if (winner === opponent) return depth - 10;
  if (isDraw(board)) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = player;
        const evaluation = minimax(board, depth + 1, false, alpha, beta, player);
        board[i] = null;
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = opponent;
        const evaluation = minimax(board, depth + 1, true, alpha, beta, player);
        board[i] = null;
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
};

export const findBestMove = (board: Board, player: Player): number => {
  // If board is empty, choose a corner or center
  if (board.every(cell => cell === null)) {
    const firstMoves = [0, 2, 6, 8, 4];
    return firstMoves[Math.floor(Math.random() * firstMoves.length)];
  }

  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = player;
      const moveScore = minimax(board, 0, false, -Infinity, Infinity, player);
      board[i] = null;

      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = i;
      }
    }
  }

  return bestMove;
};