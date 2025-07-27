
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplets, Thermometer, Eye, Wind } from 'lucide-react';

interface Station {
  id: number;
  name: string;
  position: { lat: number; lng: number };
  status: 'normal' | 'warning' | 'danger';
  data?: {
    pH: number;
    temperature: number;
    turbidity: number;
    dissolvedOxygen: number;
    lastUpdate: string;
  };
}

interface MapInfoWindowProps {
  station: Station;
  onClose: () => void;
}

const MapInfoWindow: React.FC<MapInfoWindowProps> = ({ station, onClose }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-river-success';
      case 'warning': return 'bg-river-warning';
      case 'danger': return 'bg-river-danger';
      default: return 'bg-river-blue-light';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'normal': return 'Normal';
      case 'warning': return 'Warning';
      case 'danger': return 'Critical';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="w-80 river-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{station.name}</CardTitle>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        </div>
        <Badge className={`${getStatusColor(station.status)} text-white w-fit`}>
          {getStatusText(station.status)}
        </Badge>
      </CardHeader>
      <CardContent>
        {station.data ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-river-blue-light" />
                <div>
                  <p className="text-xs text-muted-foreground">pH Level</p>
                  <p className="font-semibold">{station.data.pH.toFixed(1)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-river-success" />
                <div>
                  <p className="text-xs text-muted-foreground">Temperature</p>
                  <p className="font-semibold">{station.data.temperature.toFixed(1)}°C</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-river-warning" />
                <div>
                  <p className="text-xs text-muted-foreground">Turbidity</p>
                  <p className="font-semibold">{station.data.turbidity.toFixed(1)} NTU</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-4 w-4 text-river-purple-light" />
                <div>
                  <p className="text-xs text-muted-foreground">Dissolved O₂</p>
                  <p className="font-semibold">{station.data.dissolvedOxygen.toFixed(1)} mg/L</p>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(station.data.lastUpdate).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No data available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default MapInfoWindow;
