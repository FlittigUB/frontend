// components/common/Spinner.tsx
import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        {/* Outer Circle */}
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-500 border-opacity-20"></div>
        {/* Inner Arc */}
        <div className="absolute top-0 left-0 h-12 w-12 border-4 border-solid border-blue-500 border-t-transparent border-r-transparent rounded-full animate-spin-smooth"></div>
      </div>
    </div>
  );
};

export default Spinner;
