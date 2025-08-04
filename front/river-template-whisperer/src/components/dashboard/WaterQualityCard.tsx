
import React from 'react';
import { ArrowDown, ArrowUp, Droplets, ThermometerIcon, Activity, Timer, TestTube, FlaskRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WaterQualityCardProps {
  title: string;
  value: string | number;
  unit: string;
  change?: number;
  status?: 'positive' | 'negative' | 'neutral';
  type: 'ph' | 'oxygen' | 'temperature' | 'flow' | 'lead' | 'turbidity' | 'mercury' | 'Cyanide';
}

const WaterQualityCard: React.FC<WaterQualityCardProps> = ({
  title,
  value,
  unit,
  change = 0,
  status = 'neutral',
  type
}) => {
  // Helper function to format numbers to max 4 decimal places
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? val : num.toFixed(Math.min(4, (num.toString().split('.')[1] || '').length));
    }
    return val.toFixed(Math.min(4, (val.toString().split('.')[1] || '').length));
  };

  const getIcon = () => {
    switch (type) {
      case 'ph': return <Droplets className="h-5 w-5" />;
      case 'oxygen': return <Activity className="h-5 w-5" />;
      case 'temperature': return <ThermometerIcon className="h-5 w-5" />;
      case 'flow': return <Timer className="h-5 w-5" />;
      case 'lead': return <TestTube className="h-5 w-5" />;
      case 'mercury': return <FlaskRound className="h-5 w-5" />;
      case 'turbidity': return <FlaskRound className="h-5 w-5" />;
      case 'Cyanide': return <TestTube className="h-5 w-5" />;
      default: return <Droplets className="h-5 w-5" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-river-success';
      case 'negative': return 'text-river-danger';
      default: return 'text-river-blue-light';
    }
  };
  
  const getChangeIcon = () => {
    if (change > 0) {
      return <ArrowUp className={cn("h-4 w-4", getStatusColor('positive'))} />;
    } else if (change < 0) {
      return <ArrowDown className={cn("h-4 w-4", getStatusColor('negative'))} />;
    }
    return null;
  };
  
  return (
    <div className="river-data-card river-glow min-h-32">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="rounded-full bg-river-purple/20 p-1.5 text-river-purple-light">
          {getIcon()}
        </div>
      </div>
      
      <div className="flex items-baseline mt-4">
        <span className="text-2xl font-semibold">{formatValue(value)}</span>
        <span className="ml-1 text-muted-foreground text-sm">{unit}</span>
      </div>
      
      {change !== 0 && (
        <div className="flex items-center mt-1 text-xs">
          {getChangeIcon()}
          <span className={cn("ml-1", getStatusColor(status))}>
            {Math.abs(change).toFixed(Math.min(4, (Math.abs(change).toString().split('.')[1] || '').length))}% from last reading
          </span>
        </div>
      )}
    </div>
  );
};

export default WaterQualityCard;
