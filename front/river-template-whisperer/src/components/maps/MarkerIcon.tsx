
import React from 'react';

interface MarkerIconProps {
  status: 'normal' | 'warning' | 'danger';
  isActive?: boolean;
}

const MarkerIcon: React.FC<MarkerIconProps> = ({ status, isActive = false }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#10b981'; // river-success
      case 'warning': return '#f59e0b'; // river-warning
      case 'danger': return '#ef4444'; // river-danger
      default: return '#60a5fa'; // river-blue-light
    }
  };

  const color = getStatusColor(status);
  const size = isActive ? 20 : 16;

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-lg ${isActive ? 'animate-pulse' : ''}`}
    >
      <circle 
        cx="12" 
        cy="12" 
        r="8" 
        fill={color}
        stroke="white"
        strokeWidth="2"
      />
      <circle 
        cx="12" 
        cy="12" 
        r="4" 
        fill="white"
        opacity="0.8"
      />
      {isActive && (
        <circle 
          cx="12" 
          cy="12" 
          r="12" 
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.4"
        />
      )}
    </svg>
  );
};

export default MarkerIcon;
