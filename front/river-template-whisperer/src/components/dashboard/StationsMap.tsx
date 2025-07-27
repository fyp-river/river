
import React from 'react';
import { MapPin } from 'lucide-react';

interface Station {
  id: number;
  name: string;
  x: number;
  y: number;
  status: 'normal' | 'warning' | 'danger';
}

const stations: Station[] = [
  { id: 1, name: 'Station Alpha', x: 15, y: 20, status: 'normal' },
  { id: 2, name: 'Station Beta', x: 30, y: 50, status: 'normal' },
  { id: 3, name: 'Station Gamma', x: 50, y: 30, status: 'warning' },
  { id: 4, name: 'Station Delta', x: 70, y: 60, status: 'normal' },
  { id: 5, name: 'Station Epsilon', x: 85, y: 25, status: 'danger' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal': return 'bg-river-success';
    case 'warning': return 'bg-river-warning';
    case 'danger': return 'bg-river-danger';
    default: return 'bg-river-blue-light';
  }
};

const StationsMap: React.FC = () => {
  return (
    <div className="river-data-card river-glow h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium">Monitoring Stations</h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-river-success"></div>
            <span className="text-xs">Normal</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-river-warning"></div>
            <span className="text-xs">Warning</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-2 w-2 rounded-full bg-river-danger"></div>
            <span className="text-xs">Alert</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-[220px] w-full bg-river rounded-md overflow-hidden border border-secondary/30">
        {/* Stylized river running through the map */}
        <div className="absolute h-full w-[30%] left-[35%] bg-gradient-to-r from-transparent via-river-blue/30 to-transparent animate-flow transform rotate-45"></div>
        
        {/* Station markers */}
        {stations.map((station) => (
          <div 
            key={station.id}
            className="absolute group cursor-pointer"
            style={{ left: `${station.x}%`, top: `${station.y}%` }}
          >
            <div className={`h-3 w-3 rounded-full ${getStatusColor(station.status)} animate-glow shadow-lg shadow-${getStatusColor(station.status)}/20`}></div>
            
            {/* Tooltip */}
            <div className="invisible group-hover:visible absolute z-10 -top-10 left-1/2 -translate-x-1/2 px-2 py-1 text-xs bg-background/90 rounded border border-secondary/50 whitespace-nowrap">
              {station.name}
            </div>
          </div>
        ))}
        
        {/* Map overlay grid */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-6">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-river-blue/10"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StationsMap;
