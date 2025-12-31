
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", size = 32 }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-xl bg-[#fcf8f2] ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[80%] h-[80%]"
      >
        {/* Outer Circle */}
        <circle cx="50" cy="50" r="42" stroke="#3d3028" strokeWidth="6" />
        
        {/* Main Diagonal Arrow Line */}
        <path d="M30 70 L65 35" stroke="#3d3028" strokeWidth="8" strokeLinecap="round" />
        
        {/* Arrow Head */}
        <path d="M52 32 L75 25 L68 48" fill="#3d3028" />
        
        {/* Supporting Slant 1 (Top Left) */}
        <path d="M32 32 L50 50" stroke="#3d3028" strokeWidth="8" strokeLinecap="round" />
        
        {/* Supporting Slant 2 (Bottom Right) */}
        <path d="M50 50 L68 68" stroke="#3d3028" strokeWidth="8" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default Logo;
