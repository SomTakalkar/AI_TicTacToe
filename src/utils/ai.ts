type Player = 'X' | 'O';
type Board = (Player | null)[];

const WIN_CONDITIONS_3X3 = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const checkWinner = (board: Board): { winner: Player | null; line: number[] } => {
  for (const [a, b, c] of WIN_CONDITIONS_3X3) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
};

export const findWinningLines5x5 = (board: Board): number[][] => {
  const winningLines: number[][] = [];

  // Check rows
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const start = i * 5 + j;
      if (
        board[start] &&
        board[start] === board[start + 1] &&
        board[start] === board[start + 2]
      ) {
        winningLines.push([start, start + 1, start + 2]);
      }
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 5; j++) {
      const start = i * 5 + j;
      if (
        board[start] &&
        board[start] === board[start + 5] &&
        board[start] === board[start + 10]
      ) {
        winningLines.push([start, start + 5, start + 10]);
      }
    }
  }

  // Check diagonals
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const start = i * 5 + j;
      // Check diagonal right
      if (
        board[start] &&
        board[start] === board[start + 6] &&
        board[start] === board[start + 12]
      ) {
        winningLines.push([start, start + 6, start + 12]);
      }
      // Check diagonal left
      if (
        board[start + 2] &&
        board[start + 2] === board[start + 6] &&
        board[start + 2] === board[start + 10]
      ) {
        winningLines.push([start + 2, start + 6, start + 10]);
      }
    }
  }

  return winningLines;
};

export const countThreeInARow = (board: Board) => {
  const winningLines = findWinningLines5x5(board);
  let playerX = 0;
  let playerO = 0;

  for (const line of winningLines) {
    if (board[line[0]] === 'X') playerX++;
    if (board[line[0]] === 'O') playerO++;
  }

  return { playerX, playerO, winningLines };
};

const isDraw = (board: Board): boolean => {
  return board.every(cell => cell !== null);
};

const evaluateBoard = (board: Board, player: Player): number => {
  const { playerX, playerO } = countThreeInARow(board);
  const score = player === 'X' ? playerX - playerO : playerO - playerX;
  return score * 10;
};

const findTwoInARow = (board: Board, player: Player): number => {
  // Check rows
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const cells = [i * 5 + j, i * 5 + j + 1, i * 5 + j + 2];
      const values = cells.map(idx => board[idx]);
      if (values.filter(v => v === player).length === 2 && values.includes(null)) {
        return cells[values.indexOf(null)];
      }
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 5; j++) {
      const cells = [i * 5 + j, (i + 1) * 5 + j, (i + 2) * 5 + j];
      const values = cells.map(idx => board[idx]);
      if (values.filter(v => v === player).length === 2 && values.includes(null)) {
        return cells[values.indexOf(null)];
      }
    }
  }

  return -1;
};

const minimax = (
  board: Board,
  depth: number,
  maxDepth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  player: Player
): number => {
  // Early termination for 5x5 grid
  if (board.length === 25) {
    if (depth >= maxDepth) {
      return evaluateBoard(board, player);
    }
  } else {
    // 3x3 grid logic
    const opponent: Player = player === 'O' ? 'X' : 'O';
    const winner = checkWinner(board).winner;
    if (winner === player) return 10 - depth;
    if (winner === opponent) return depth - 10;
    if (isDraw(board)) return 0;
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = player;
        const evaluation = minimax(board, depth + 1, maxDepth, false, alpha, beta, player);
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
        board[i] = player === 'X' ? 'O' : 'X';
        const evaluation = minimax(board, depth + 1, maxDepth, true, alpha, beta, player);
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
  // If board is empty, choose a strategic position
  if (board.every(cell => cell === null)) {
    if (board.length === 25) {
      // For 5x5, prefer center and adjacent positions
      const firstMoves = [12, 6, 8, 16, 18];
      return firstMoves[Math.floor(Math.random() * firstMoves.length)];
    } else {
      // For 3x3, use corners or center
      const firstMoves = [0, 2, 6, 8, 4];
      return firstMoves[Math.floor(Math.random() * firstMoves.length)];
    }
  }

  // Check for immediate winning moves or blocking opponent's winning moves
  const twoInARow = findTwoInARow(board, player);
  if (twoInARow !== -1) return twoInARow;

  const opponent = player === 'X' ? 'O' : 'X';
  const blockMove = findTwoInARow(board, opponent);
  if (blockMove !== -1) return blockMove;

  // Use minimax with depth limit for 5x5 grid
  const maxDepth = board.length === 25 ? 3 : 6;
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = player;
      const moveScore = minimax(board, 0, maxDepth, false, -Infinity, Infinity, player);
      board[i] = null;

      if (moveScore > bestScore) {
        bestScore = moveScore;
        bestMove = i;
      }
    }
  }

  return bestMove;
};
