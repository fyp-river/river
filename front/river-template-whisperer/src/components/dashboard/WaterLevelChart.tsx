
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const waterLevelData = [
  { time: '00:00', level: 2.4 },
  { time: '02:00', level: 2.3 },
  { time: '04:00', level: 2.2 },
  { time: '06:00', level: 2.1 },
  { time: '08:00', level: 2.3 },
  { time: '10:00', level: 2.5 },
  { time: '12:00', level: 2.7 },
  { time: '14:00', level: 3.0 },
  { time: '16:00', level: 3.2 },
  { time: '18:00', level: 3.0 },
  { time: '20:00', level: 2.8 },
  { time: '22:00', level: 2.6 }
];

const WaterLevelChart: React.FC = () => {
  return (
    <div className="river-data-card river-glow h-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium">Water Level (24h)</h3>
        <div className="flex items-center text-xs space-x-2">
          <span className="px-2 py-1 rounded bg-river-purple-light/10 text-river-purple-light">24h</span>
          <span className="px-2 py-1 rounded hover:bg-secondary/70 cursor-pointer">7d</span>
          <span className="px-2 py-1 rounded hover:bg-secondary/70 cursor-pointer">30d</span>
        </div>
      </div>
      
      <div className="h-full w-full water-effect">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={waterLevelData}
            margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#33C3F0" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#E6F1FF', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#E6F1FF', fontSize: 12 }}
              domain={[1.5, 'auto']}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(26, 31, 44, 0.8)',
                borderColor: 'rgba(126, 105, 171, 0.5)',
                borderRadius: '0.5rem',
                color: '#E6F1FF'
              }}
              labelStyle={{ color: '#E6F1FF' }}
            />
            <Line 
              type="monotone" 
              dataKey="level" 
              stroke="#9b87f5" 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: '#9b87f5', stroke: '#1A1F2C', strokeWidth: 2 }}
              fillOpacity={1}
              fill="url(#colorLevel)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WaterLevelChart;
