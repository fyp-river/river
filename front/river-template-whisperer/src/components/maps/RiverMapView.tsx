import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Navigation, Wifi, WifiOff } from 'lucide-react';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';
import MapInfoWindow from './MapInfoWindow';
import MarkerIcon from './MarkerIcon';
import { riverPathCoordinates } from './RiverPath';

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  timestamp: string;
  data?: any;
}

const RiverMapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const djangoWs = useDjangoWebSocket();
  const mapWs = useMapWebSocket();
  
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);

  // Helper function to format numbers to max 4 decimal places
  const formatSensorValue = (value: any): string => {
    if (value === null || value === undefined) return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toFixed(Math.min(4, (num.toString().split('.')[1] || '').length));
  };

  // Generate map points from sensor data
  useEffect(() => {
    if (djangoWs.sensorData.length > 0) {
      const stationIds = [...new Set(djangoWs.sensorData.map(reading => reading.stationId))];
      const newPoints: MapPoint[] = stationIds.map((stationId, index) => {
        const latestReading = djangoWs.sensorData
          .filter(reading => reading.stationId === stationId)
          .slice(-1)[0];
        
        return {
          id: `point-${index}`,
          lat: 5.607534 + (index * 0.001), // Base coordinates with offset
          lng: -0.182842 + (index * 0.001),
          name: `Station ${stationId}`,
          timestamp: latestReading?.timestamp || new Date().toISOString(),
          data: latestReading
        };
      });
      
      setMapPoints(newPoints);
    }
  }, [djangoWs.sensorData]);

  // Handle map WebSocket data
  useEffect(() => {
    if (mapWs.mapData.length > 0) {
      const latestMapData = mapWs.mapData[mapWs.mapData.length - 1];
      if (latestMapData.lat && latestMapData.lng) {
        setMapPoints(prev => {
          const existingIndex = prev.findIndex(point => point.id === latestMapData.id);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              lat: latestMapData.lat,
              lng: latestMapData.lng,
              timestamp: latestMapData.timestamp
            };
            return updated;
          } else {
            return [...prev, {
              id: latestMapData.id || `map-${Date.now()}`,
              lat: latestMapData.lat,
              lng: latestMapData.lng,
              name: latestMapData.name || 'Unknown Location',
              timestamp: latestMapData.timestamp,
              data: latestMapData
            }];
          }
        });
      }
    }
  }, [mapWs.mapData]);

  // Connection status
  const isConnected = djangoWs.isConnected || mapWs.isConnected;
  const connectionError = djangoWs.error || mapWs.error;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">River Map</h2>
          <p className="text-sm text-muted-foreground">
            Real-time sensor locations and water quality data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Connection Error */}
      {connectionError && (
        <Alert variant="destructive" className="m-4">
          <AlertDescription>
            Connection Error: {connectionError}
          </AlertDescription>
        </Alert>
      )}

      {/* Map Container */}
      <div className="flex-1 relative">
        <div 
          ref={mapRef}
          className="w-full h-full bg-muted/20 flex items-center justify-center"
        >
          <div className="text-center text-muted-foreground">
            <Navigation className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Map visualization would be here</p>
            <p className="text-sm">Showing {mapPoints.length} sensor locations</p>
          </div>
        </div>

        {/* Map Points Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {mapPoints.map((point) => (
            <div
              key={point.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto"
              style={{
                left: `${((point.lng + 0.183) / 0.002) * 100}%`,
                top: `${((point.lat - 5.607) / 0.002) * 100}%`
              }}
              onClick={() => setSelectedPoint(point)}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded text-xs shadow-sm whitespace-nowrap">
                  {point.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l bg-background">
        <div className="p-4">
          <h3 className="font-semibold mb-4">Sensor Locations</h3>
          
          {mapPoints.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No sensor locations available</p>
              <p className="text-sm">Connect to receive real-time data</p>
            </div>
          ) : (
            <div className="space-y-2">
              {mapPoints.map((point) => (
                <Card 
                  key={point.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedPoint?.id === point.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedPoint(point)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{point.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(point.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {point.data ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Selected Point Details */}
        {selectedPoint && (
          <div className="border-t p-4">
            <h4 className="font-semibold mb-3">Location Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <span className="ml-2">{selectedPoint.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Coordinates:</span>
                <span className="ml-2">
                  {selectedPoint.lat.toFixed(6)}, {selectedPoint.lng.toFixed(6)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Update:</span>
                <span className="ml-2">
                  {new Date(selectedPoint.timestamp).toLocaleString()}
                </span>
              </div>
              
              {selectedPoint.data && (
                <div className="mt-4 pt-4 border-t">
                  <h5 className="font-medium mb-2">Sensor Data</h5>
                  <div className="space-y-1 text-xs">
                    {selectedPoint.data.temperature && (
                      <div>Temperature: {formatSensorValue(selectedPoint.data.temperature)}°C</div>
                    )}
                    {selectedPoint.data.pH && (
                      <div>pH: {formatSensorValue(selectedPoint.data.pH)}</div>
                    )}
                    {selectedPoint.data.turbidity && (
                      <div>Turbidity: {formatSensorValue(selectedPoint.data.turbidity)} NTU</div>
                    )}
                    {selectedPoint.data.dissolvedOxygen && (
                      <div>Dissolved Oxygen: {formatSensorValue(selectedPoint.data.dissolvedOxygen)} mg/L</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiverMapView;
