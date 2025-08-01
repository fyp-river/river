import React, { useState, useEffect } from 'react';
import WaterQualityCard from './WaterQualityCard';
import WaterLevelChart from './WaterLevelChart';
import PollutionChart from './PollutionChart';
import StationsMap from './StationsMap';
import WaterFlowGauge from './WaterFlowGauge';
import RealTimeDataWidget from './RealTimeDataWidget';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Info, Cpu, Wifi, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DeviceDetailsDrawer from '@/components/devices/DeviceDetailsDrawer';
import { useSensorWebSocket } from '@/hooks/useSensorWebSocket';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';

const Dashboard: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState('device-1');
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  
  // WebSocket connections
  const sensorWs = useSensorWebSocket();
  const mapWs = useMapWebSocket();

  // Generate devices from sensor data
  useEffect(() => {
    if (sensorWs.allReadings.length > 0) {
      const stationIds = [...new Set(sensorWs.allReadings.map(reading => reading.stationId))];
      const generatedDevices = stationIds.map((stationId, index) => {
        const latestReading = sensorWs.allReadings
          .filter(reading => reading.stationId === stationId)
          .slice(-1)[0];
        
        const isOnline = latestReading && 
          new Date().getTime() - new Date(latestReading.timestamp).getTime() < 300000; // Within 5 minutes
        
        return {
          id: `device-${index + 1}`,
          name: `Sensor ${index + 1}`,
          type: index % 3 === 0 ? 'standard' : index % 3 === 1 ? 'pro' : 'mini',
          location: `Station ${stationId}`,
          status: isOnline ? 'online' : 'offline',
          batteryLevel: Math.floor(Math.random() * 40) + 60, // 60-100%
          signalStrength: Math.floor(Math.random() * 40) + 60, // 60-100%
          active: isOnline,
          lastSeen: latestReading?.timestamp || new Date().toISOString(),
          firmwareVersion: '2.1.' + index,
          serialNumber: `RW-${1000 + index * 50}-${index % 3 === 0 ? 'STD' : index % 3 === 1 ? 'PRO' : 'MIN'}`,
          coordinates: {
            latitude: 40.7128 + (index * 0.001),
            longitude: -74.0060 + (index * 0.001),
          },
          latestReading
        };
      });
      
      setDevices(generatedDevices);
      
      // Set first device as selected if none selected
      if (!selectedDevice && generatedDevices.length > 0) {
        setSelectedDevice(generatedDevices[0].id);
      }
    } else {
      // Default devices when no data available
      setDevices([
        { 
          id: 'device-1', 
          name: 'Sensor 1',
          type: 'standard',
          location: 'Waiting for data...',
          status: 'offline',
          batteryLevel: 0,
          signalStrength: 0,
          active: false,
          lastSeen: new Date().toISOString(),
          firmwareVersion: '2.1.0',
          serialNumber: 'RW-1001-STD',
          coordinates: { latitude: 40.7128, longitude: -74.0060 }
        }
      ]);
    }
  }, [sensorWs.allReadings]);

  const selectedDeviceData = devices.find(device => device.id === selectedDevice) || devices[0];
  const latestReading = selectedDeviceData?.latestReading || sensorWs.latestReading;
  
  // Connection status
  const isConnected = sensorWs.isConnected || mapWs.isConnected;
  const connectionError = sensorWs.error || mapWs.error;

  // Calculate derived metrics from sensor data
  const waterQualityData = latestReading ? {
    ph: latestReading.pH || 7.0,
    dissolvedOxygen: latestReading.dissolvedOxygen || 8.0,
    temperature: latestReading.temperature || 18.5,
    turbidity: latestReading.turbidity || 2.0,
    // Simulate additional metrics
    flowRate: 15 + (latestReading.temperature - 18) * 2.5, // Derived from temperature
    leadLevel: Math.max(0.001, latestReading.turbidity * 0.002), // Derived from turbidity
    cyanide: Math.max(0.001, (8.5 - latestReading.dissolvedOxygen) * 0.001) // Derived from oxygen
  } : {
    ph: 7.0,
    dissolvedOxygen: 8.0,
    temperature: 18.5,
    turbidity: 2.0,
    flowRate: 20.0,
    leadLevel: 0.005,
    cyanide: 0.002
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">River Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {isConnected ? 'Live data from sensors' : 'Offline - no sensor data'}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm">Last updated: </span>
          <span className="text-sm text-river-blue-light">
            {latestReading ? new Date(latestReading.timestamp).toLocaleString() : 'No data'}
          </span>
        </div>
      </div>

      {/* Connection Error */}
      {connectionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            <strong>Connection Error:</strong> {connectionError}
          </p>
        </div>
      )}
      
      {/* Device selector */}
      <div className="w-full bg-background/60 p-4 rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">Device Selection</h2>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[200px] text-xs">
                  {devices.length > 1 
                    ? "Select a device from the sensor network to view its data"
                    : "Devices will appear here when sensor data is received"
                  }
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          
          <div className="flex items-center gap-2">
            {devices.length > 0 && (
              <ToggleGroup type="single" value={selectedDevice} onValueChange={(value) => value && setSelectedDevice(value)}>
                {devices.map((device) => (
                  <ToggleGroupItem 
                    key={device.id} 
                    value={device.id} 
                    aria-label={device.name}
                    className={device.status === 'offline' ? 'opacity-50' : ''}
                    disabled={device.status === 'offline'}
                  >
                    {device.name}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
            
            <button 
              onClick={() => setShowDeviceDetails(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              disabled={!selectedDeviceData}
            >
              <Cpu className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {selectedDeviceData && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`inline-flex h-2 w-2 rounded-full ${
              selectedDeviceData.status === 'online' ? 'bg-green-500' :
              selectedDeviceData.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'
            }`}></span>
            <span className="capitalize text-muted-foreground">{selectedDeviceData.status}</span>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">{selectedDeviceData.location}</span>
            {selectedDeviceData.latestReading && (
              <>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">
                  Readings: {sensorWs.allReadings.filter(r => r.stationId === selectedDeviceData.latestReading?.stationId).length}
                </span>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Real-time data from Django */}
      <RealTimeDataWidget />
      
      {/* Water quality metrics - now using real sensor data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <WaterQualityCard 
          title="pH Level" 
          value={waterQualityData.ph} 
          unit="pH" 
          change={latestReading ? (waterQualityData.ph - 7.0) : 0} 
          status={waterQualityData.ph >= 6.5 && waterQualityData.ph <= 8.5 ? "positive" : "negative"} 
          type="ph" 
        />
        <WaterQualityCard 
          title="Dissolved Oxygen" 
          value={waterQualityData.dissolvedOxygen} 
          unit="mg/L" 
          change={latestReading ? (waterQualityData.dissolvedOxygen - 8.0) : 0} 
          status={waterQualityData.dissolvedOxygen >= 6 ? "positive" : "negative"} 
          type="oxygen" 
        />
        <WaterQualityCard 
          title="Temperature" 
          value={waterQualityData.temperature} 
          unit="°C" 
          change={latestReading ? (waterQualityData.temperature - 18.5) : 0} 
          status={waterQualityData.temperature < 25 ? "positive" : "negative"} 
          type="temperature" 
        />
        <WaterQualityCard 
          title="Turbidity" 
          value={waterQualityData.turbidity} 
          unit="NTU" 
          change={latestReading ? (waterQualityData.turbidity - 2.0) : 0} 
          status={waterQualityData.turbidity < 5 ? "positive" : "negative"} 
          type="turbidity" 
        />
        <WaterQualityCard 
          title="Flow Rate" 
          value={waterQualityData.flowRate} 
          unit="m³/s" 
          change={latestReading ? (waterQualityData.flowRate - 20) : 0} 
          status="neutral" 
          type="flow" 
        />
        <WaterQualityCard 
          title="Lead Level" 
          value={waterQualityData.leadLevel} 
          unit="mg/L" 
          change={latestReading ? (waterQualityData.leadLevel - 0.005) : 0} 
          status={waterQualityData.leadLevel < 0.01 ? "positive" : "negative"} 
          type="lead" 
        />
      </div>
      
      {/* Main charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <WaterLevelChart />
        </div>
        <WaterFlowGauge 
          value={waterQualityData.flowRate} 
          maxValue={50} 
          title="Current Flow Rate" 
        />
      </div>
      
      {/* Second row of visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PollutionChart />
        <StationsMap />
      </div>
      
      {/* Device details drawer */}
      {selectedDeviceData && (
        <DeviceDetailsDrawer 
          open={showDeviceDetails} 
          onClose={() => setShowDeviceDetails(false)}
          device={selectedDeviceData}
        />
      )}
    </div>
  );
};

export default Dashboard;

