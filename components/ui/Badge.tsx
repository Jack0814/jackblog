import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, onClick, className = '' }) => {
  return (
    <span 
      onClick={onClick}
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
        bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300
        border border-indigo-200 dark:border-indigo-800
        ${onClick ? 'cursor-pointer hover:bg-indigo-200 dark:hover:bg-indigo-900/50' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
};
