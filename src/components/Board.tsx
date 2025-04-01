import React from 'react';
import Cell from './Cell';

interface BoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  winningLines: number[][];
  gridSize: '3x3' | '5x5';
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, winningLines, gridSize }) => {
  return (
    <div 
      className={`grid gap-2 w-fit ${
        gridSize === '3x3' ? 'grid-cols-3' : 'grid-cols-5'
      }`}
    >
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          isWinning={winningLines.some(line => line.includes(index))}
          size={gridSize === '3x3' ? 'large' : 'small'}
        />
      ))}
    </div>
  );
};

export default Board;
