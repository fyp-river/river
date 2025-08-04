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
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';
import { PulseLoader, ClipLoader } from 'react-spinners';

const Dashboard: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState('device-1');
  const [showDeviceDetails, setShowDeviceDetails] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);
  
  // WebSocket connections
  const djangoWs = useDjangoWebSocket();
  const mapWs = useMapWebSocket();

  // Generate devices from sensor data
  useEffect(() => {
    console.log('djangoWs.sensorData', djangoWs);
    if (djangoWs.sensorData.length > 0) {
      const stationIds = [...new Set(djangoWs.sensorData.map(reading => reading.stationId))];
      const generatedDevices = stationIds.map((stationId, index) => {
        const latestReading = djangoWs.sensorData
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
  }, [djangoWs.sensorData]);

  const selectedDeviceData = devices.find(device => device.id === selectedDevice) || devices[0];
  const latestReading = selectedDeviceData?.latestReading || (djangoWs.sensorData.length > 0 ? djangoWs.sensorData[djangoWs.sensorData.length - 1] : null);
  
  // Connection status
  const isConnected = djangoWs.isConnected || mapWs.isConnected;
  const connectionError = djangoWs.error || mapWs.error;

  // Loading states
  const isDataLoading = !isConnected || djangoWs.sensorData.length === 0;
  const isConnecting = !isConnected && !connectionError;

  // Calculate derived metrics from sensor data
  const waterQualityData = latestReading ? {
    ph: Number((latestReading.pH || 7.0).toFixed(Math.min(4, (latestReading.pH || 7.0).toString().split('.')[1]?.length || 0))),
    dissolvedOxygen: Number((latestReading.dissolvedOxygen || 8.0).toFixed(Math.min(4, (latestReading.dissolvedOxygen || 8.0).toString().split('.')[1]?.length || 0))),
    temperature: Number((latestReading.temperature || 18.5).toFixed(Math.min(4, (latestReading.temperature || 18.5).toString().split('.')[1]?.length || 0))),
    turbidity: Number((latestReading.turbidity || 2.0).toFixed(Math.min(4, (latestReading.turbidity || 2.0).toString().split('.')[1]?.length || 0))),
    // Simulate additional metrics
    flowRate: Number((15 + (latestReading.temperature - 18) * 2.5).toFixed(Math.min(4, (15 + (latestReading.temperature - 18) * 2.5).toString().split('.')[1]?.length || 0))), // Derived from temperature
    leadLevel: Number((Math.max(0.001, latestReading.turbidity * 0.002)).toFixed(Math.min(4, (Math.max(0.001, latestReading.turbidity * 0.002)).toString().split('.')[1]?.length || 0))), // Derived from turbidity
    cyanide: Number((Math.max(0.001, (8.5 - latestReading.dissolvedOxygen) * 0.001)).toFixed(Math.min(4, (Math.max(0.001, (8.5 - latestReading.dissolvedOxygen) * 0.001)).toString().split('.')[1]?.length || 0))) // Derived from oxygen
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
              {isConnected ? 'Live data from sensors' : isConnecting ? 'Connecting to sensors...' : 'Offline - no sensor data'}
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
                  Readings: {djangoWs.sensorData.filter(r => r.stationId === selectedDeviceData.latestReading?.stationId).length}
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
        {isDataLoading ? (
          // Loading spinners for water quality cards
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="river-data-card river-glow min-h-32 flex items-center justify-center">
              <div className="text-center">
                <PulseLoader size={8} color="#3B82F6" />
                <p className="text-sm text-muted-foreground mt-2">Loading...</p>
              </div>
            </div>
          ))
        ) : (
          <>
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
          </>
        )}
      </div>
      
      {/* Main charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          {isDataLoading ? (
            <div className="river-data-card river-glow h-64 flex items-center justify-center">
              <div className="text-center">
                <ClipLoader size={30} color="#3B82F6" />
                <p className="text-sm text-muted-foreground mt-2">Loading water level chart...</p>
              </div>
            </div>
          ) : (
            <WaterLevelChart />
          )}
        </div>
        <div>
          {isDataLoading ? (
            <div className="river-data-card river-glow h-64 flex items-center justify-center">
              <div className="text-center">
                <PulseLoader size={8} color="#3B82F6" />
                <p className="text-sm text-muted-foreground mt-2">Loading flow gauge...</p>
              </div>
            </div>
          ) : (
            <WaterFlowGauge 
              value={waterQualityData.flowRate} 
              maxValue={50} 
              title="Current Flow Rate" 
            />
          )}
        </div>
      </div>
      
      {/* Second row of visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {isDataLoading ? (
          <>
            <div className="river-data-card river-glow h-64 flex items-center justify-center">
              <div className="text-center">
                <ClipLoader size={30} color="#3B82F6" />
                <p className="text-sm text-muted-foreground mt-2">Loading pollution chart...</p>
              </div>
            </div>
            <div className="river-data-card river-glow h-64 flex items-center justify-center">
              <div className="text-center">
                <PulseLoader size={8} color="#3B82F6" />
                <p className="text-sm text-muted-foreground mt-2">Loading stations map...</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <PollutionChart />
            <StationsMap />
          </>
        )}
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

