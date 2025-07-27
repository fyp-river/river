import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, Layers, Navigation, Zap } from 'lucide-react';
import { useSensorWebSocket } from '@/hooks/useSensorWebSocket';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';
import MapInfoWindow from './MapInfoWindow';
import MarkerIcon from './MarkerIcon';
import { riverPathCoordinates } from './RiverPath';

const RiverMapView: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedStation, setSelectedStation] = useState<any>(null);
  const [stations, setStations] = useState<any[]>([]);
  
  // WebSocket connections
  const sensorWs = useSensorWebSocket();
  const mapWs = useMapWebSocket();

  // Generate stations from sensor data
  useEffect(() => {
    if (sensorWs.allReadings.length > 0) {
      const stationIds = [...new Set(sensorWs.allReadings.map(reading => reading.stationId))];
      const generatedStations = stationIds.map((stationId, index) => {
        const stationReadings = sensorWs.allReadings.filter(reading => reading.stationId === stationId);
        const latestReading = stationReadings[stationReadings.length - 1];
        
        // Determine status based on sensor values
        let status: 'normal' | 'warning' | 'danger' = 'normal';
        
        if (latestReading) {
          const { pH, temperature, turbidity, dissolvedOxygen } = latestReading;
          
          // Critical conditions
          if (pH < 6.0 || pH > 9.0 || temperature > 30 || turbidity > 10 || dissolvedOxygen < 4) {
            status = 'danger';
          }
          // Warning conditions
          else if (pH < 6.5 || pH > 8.5 || temperature > 25 || turbidity > 5 || dissolvedOxygen < 6) {
            status = 'warning';
          }
        }
        
        return {
          id: index + 1,
          name: `Station ${stationId}`,
          position: { 
            lat: 40.712776 + (index * 0.01), 
            lng: -74.005974 + (index * 0.01) 
          },
          status,
          data: latestReading ? {
            pH: latestReading.pH,
            temperature: latestReading.temperature,
            turbidity: latestReading.turbidity,
            dissolvedOxygen: latestReading.dissolvedOxygen,
            lastUpdate: latestReading.timestamp
          } : {
            pH: 7.0,
            temperature: 18.5,
            turbidity: 2.0,
            dissolvedOxygen: 8.0,
            lastUpdate: new Date().toISOString()
          },
          readingsCount: stationReadings.length,
          isLive: latestReading && (new Date().getTime() - new Date(latestReading.timestamp).getTime()) < 300000 // Within 5 minutes
        };
      });
      
      setStations(generatedStations);
    } else {
      // Default stations when no data available
      setStations([
        { 
          id: 1, 
          name: 'Waiting for sensor data...', 
          position: { lat: 40.712776, lng: -74.005974 }, 
          status: 'normal' as const,
          data: {
            pH: 0,
            temperature: 0,
            turbidity: 0,
            dissolvedOxygen: 0,
            lastUpdate: new Date().toISOString()
          },
          readingsCount: 0,
          isLive: false
        }
      ]);
    }
  }, [sensorWs.allReadings]);

  // Initialize Google Map
  useEffect(() => {
    if (mapRef.current && !map && typeof google !== 'undefined') {
      const googleMap = new google.maps.Map(mapRef.current, {
        center: { lat: 40.730610, lng: -73.985242 },
        zoom: 12,
        styles: [
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#4A90E2" }]
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#F5F5F5" }]
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#FFFFFF" }]
          }
        ]
      });

      setMap(googleMap);
    }
  }, [map]);

  // Add markers and river path to map
  useEffect(() => {
    if (map && stations.length > 0) {
      // Clear existing markers
      map.data.forEach((feature) => {
        map.data.remove(feature);
      });

      // Add river path
      const riverPath = new google.maps.Polyline({
        path: riverPathCoordinates,
        geodesic: true,
        strokeColor: '#4A90E2',
        strokeOpacity: 0.8,
        strokeWeight: 4,
      });
      riverPath.setMap(map);

      // Add station markers
      stations.forEach((station) => {
        const marker = new google.maps.Marker({
          position: station.position,
          map: map,
          title: station.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: station.status === 'danger' ? '#EF4444' : 
                      station.status === 'warning' ? '#F59E0B' : '#10B981',
            fillOpacity: 0.8,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          }
        });

        marker.addListener('click', () => {
          setSelectedStation(station);
        });
      });
    }
  }, [map, stations]);

  const connectionStatus = sensorWs.isConnected || mapWs.isConnected;

  return (
    <div className="relative w-full h-full">
      {/* Connection Status Overlay */}
      <div className="absolute top-4 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm p-3">
          <div className="flex items-center gap-2">
            <Zap className={`h-4 w-4 ${connectionStatus ? 'text-green-500' : 'text-red-500'}`} />
            <span className="text-sm font-medium">
              {connectionStatus ? 'Live Data' : 'Offline'}
            </span>
            {sensorWs.allReadings.length > 0 && (
              <span className="text-xs text-muted-foreground">
                ({sensorWs.allReadings.length} readings)
              </span>
            )}
          </div>
        </Card>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm p-2">
          <div className="flex flex-col gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => map?.setZoom((map.getZoom() || 12) + 1)}
              title="Zoom In"
            >
              <Layers className="h-4 w-4" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded"
              onClick={() => map?.setCenter({ lat: 40.730610, lng: -73.985242 })}
              title="Center Map"
            >
              <Navigation className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>

      {/* Error Display */}
      {!connectionStatus && sensorWs.allReadings.length === 0 && (
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <Card className="bg-orange-50 border-orange-200 p-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                No sensor data available. Map showing default positions.
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Info Window */}
      {selectedStation && (
        <MapInfoWindow
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
          position={{ x: 50, y: 50 }} // You might want to calculate this based on marker position
        />
      )}

      {/* Station Status Summary */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm p-3">
          <div className="text-xs space-y-1">
            <div className="font-medium">Station Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Normal: {stations.filter(s => s.status === 'normal').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Warning: {stations.filter(s => s.status === 'warning').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Critical: {stations.filter(s => s.status === 'danger').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Live: {stations.filter(s => s.isLive).length}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RiverMapView;
