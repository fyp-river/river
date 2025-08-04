
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';

const RealTimeDataWidget = () => {
  const { isConnected, sensorData } = useDjangoWebSocket();
  const latestData = sensorData[sensorData.length - 1];

  return (
    <Card className="river-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-river-blue-light" />
            Real-Time Monitoring
          </CardTitle>
          <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
            {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {isConnected ? 'Live' : 'Offline'}
          </Badge>
        </div>
        <CardDescription>
          Live water quality data from Django backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        {latestData ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">pH Level</p>
              <p className="text-2xl font-bold text-river-blue-light">
                {latestData.pH.toFixed(2)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Turbidity</p>
              <p className="text-2xl font-bold text-river-warning">
                {latestData.turbidity.toFixed(1)} NTU
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Conductivity</p>
              <p className="text-2xl font-bold text-river-success">
                {latestData.conductivity?.toFixed(1) || '0.0'} µS/cm
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Cyanide</p>
              <p className="text-2xl font-bold text-river-danger">
                {latestData.ise?.toFixed(3) || '0.000'} mg/L
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Mercury Level</p>
              <p className="text-2xl font-bold text-river-purple-light">
                {latestData.value?.toFixed(3) || '0.000'} mg/L
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Waiting for data from Django backend...</p>
        )}
        
        {sensorData.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Last updated: {new Date(latestData?.timestamp || '').toLocaleTimeString()}
            </p>
            <p className="text-xs text-muted-foreground">
              Data points received: {sensorData.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Station: {latestData?.stationId}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeDataWidget;
