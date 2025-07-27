
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Value', value: 65 },
  { name: 'Remaining', value: 35 },
];

interface WaterFlowGaugeProps {
  value: number;
  maxValue: number;
  title: string;
}

const WaterFlowGauge: React.FC<WaterFlowGaugeProps> = ({ value, maxValue, title }) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  const adjustedData = [
    { name: 'Value', value: percentage },
    { name: 'Remaining', value: 100 - percentage },
  ];
  
  // Determine color based on value
  const getColor = () => {
    if (percentage > 80) return "#F44336"; // Danger
    if (percentage > 60) return "#FFC107"; // Warning
    return "#33C3F0"; // Normal
  };
  
  return (
    <div className="river-data-card river-glow flex flex-col items-center">
      <h3 className="text-base font-medium mb-2">{title}</h3>
      
      <div className="relative w-full aspect-square max-w-36 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={adjustedData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell key="cell-0" fill={getColor()} />
              <Cell key="cell-1" fill="rgba(255,255,255,0.05)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold">{value}</span>
          <span className="text-xs text-muted-foreground">m³/s</span>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2 text-center">
        Average flow rate: {Math.round(maxValue * 0.6)} m³/s
      </div>
    </div>
  );
};

export default WaterFlowGauge;
