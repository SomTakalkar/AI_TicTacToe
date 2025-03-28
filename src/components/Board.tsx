import React from 'react';
import Cell from './Cell';

interface BoardProps {
  board: (string | null)[];
  onCellClick: (index: number) => void;
  winningLine: number[];
}

const Board: React.FC<BoardProps> = ({ board, onCellClick, winningLine }) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-fit">
      {board.map((value, index) => (
        <Cell
          key={index}
          value={value}
          onClick={() => onCellClick(index)}
          isWinning={winningLine.includes(index)}
        />
      ))}
    </div>
  );
};

export default Board;