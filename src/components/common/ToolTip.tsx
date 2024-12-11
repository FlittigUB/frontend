// components/common/Tooltip.tsx
import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactElement;
  width?: string; // Optional width class (e.g., 'w-32', 'w-48')
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, width = 'w-40' }) => {
  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 ${width}`}
      >
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-t-4 border-t-gray-700 border-l-4 border-l-transparent border-r-4 border-r-transparent"></div>
      </div>
    </div>
  );
};

export default Tooltip;
