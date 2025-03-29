import React from 'react';

interface CellProps {
  value: string | null;
  onClick: () => void;
  isWinning: boolean;
  size: 'large' | 'small';
}

const Cell: React.FC<CellProps> = ({ value, onClick, isWinning, size }) => {
  return (
    <button
      className={`
        ${size === 'large' ? 'w-20 h-20' : 'w-14 h-14'} 
        border-2 border-gray-300 
        ${!value && 'hover:bg-gray-100'} 
        ${isWinning ? 'bg-green-200 border-green-400' : 'bg-white'}
        ${value === 'X' ? 'text-blue-600' : 'text-red-600'}
        ${size === 'large' ? 'text-4xl' : 'text-2xl'}
        font-bold transition-all duration-200
      `}
      onClick={onClick}
      disabled={!!value}
    >
      {value}
    </button>
  );
};

export default Cell;
