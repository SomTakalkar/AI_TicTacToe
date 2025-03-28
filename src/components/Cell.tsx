import React from 'react';

interface CellProps {
  value: string | null;
  onClick: () => void;
  isWinning: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, isWinning }) => {
  return (
    <button
      className={`w-20 h-20 border-2 border-gray-300 text-4xl font-bold transition-all duration-200 
        ${!value && 'hover:bg-gray-100'} 
        ${isWinning ? 'bg-green-200 border-green-400' : 'bg-white'}
        ${value === 'X' ? 'text-blue-600' : 'text-red-600'}`}
      onClick={onClick}
      disabled={!!value}
    >
      {value}
    </button>
  );
};

export default Cell;