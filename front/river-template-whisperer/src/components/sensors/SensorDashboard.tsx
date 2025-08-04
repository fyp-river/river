
import React, { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import SensorTable from './SensorTable';
import WebSocketStatusIndicator from './WebSocketStatusIndicator';
import { useSensorData } from '@/hooks/useSensorData';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';

const SensorDashboard: React.FC = () => {
  const { schema, sensors, loading, error, refetch } = useSensorData();
  const { isConnected, sensorData, error: wsError } = useDjangoWebSocket();

  // Helper function to format numbers to max 4 decimal places
  const formatSensorValue = (value: any): string => {
    if (value === null || value === undefined) return '0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toFixed(Math.min(4, (num.toString().split('.')[1] || '').length));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sensor Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time sensor data from Django backend
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* WebSocket Status */}
          <WebSocketStatusIndicator 
            isConnected={isConnected}
            error={wsError}
          />
          
          {/* Refresh Button */}
          <Button 
            onClick={refetch} 
            variant="outline" 
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Schema Info */}
      {schema && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Schema Information</h3>
          <p className="text-sm text-muted-foreground">
            Model: <code className="bg-background px-1 rounded">{schema.model}</code>
          </p>
          <p className="text-sm text-muted-foreground">
            Fields: <code className="bg-background px-1 rounded">
              {schema.fields.map(f => f.name).join(', ')}
            </code>
          </p>
        </div>
      )}

      {/* Live Data Alert */}
      {sensorData.length > 0 && (
        <Alert>
          <AlertDescription>
            🟢 Latest reading received at {new Date(sensorData[sensorData.length - 1].timestamp || '').toLocaleTimeString()}
            {sensorData[sensorData.length - 1].stationId && ` from device ${sensorData[sensorData.length - 1].stationId}`}
            {sensorData[sensorData.length - 1].temperature && ` • Temperature: ${formatSensorValue(sensorData[sensorData.length - 1].temperature)}°C`}
          </AlertDescription>
        </Alert>
      )}

      {/* Sensor Data Table */}
      {schema ? (
        <SensorTable 
          schema={schema} 
          readings={sensorData.length > 0 ? sensorData : sensors}
          latestReading={sensorData.length > 0 ? sensorData[sensorData.length - 1] : null}
        />
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading sensor schema...</span>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Unable to load sensor schema
        </div>
      )}

      {/* Stats */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {sensorData.length > 0 ? sensorData.length : sensors.length} sensor record{(sensorData.length > 0 ? sensorData.length : sensors.length) !== 1 ? 's' : ''}
        {isConnected && (
          <span className="ml-4 text-green-600">
            ● Live connection active
          </span>
        )}
      </div>
    </div>
  );
};

export default SensorDashboard;
