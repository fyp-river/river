
import { useCallback, useEffect, useState } from 'react';
import { useWebSocketContext } from '@/providers/WebSocketProvider';
import { WaterQualityData } from '@/hooks/useRealTimeData';

export interface DjangoMessage {
  type: 'sensor_data' | 'device_status' | 'alert' | 'command' | 'heartbeat';
  device_id?: string;
  data: any;
  timestamp?: string;
}

export const useDjangoWebSocket = () => {
  const { isConnected, lastMessage, sendMessage, error } = useWebSocketContext();
  const [sensorData, setSensorData] = useState<WaterQualityData[]>([]);
  const [deviceStatuses, setDeviceStatuses] = useState<Record<string, any>>({});

  // Handle incoming messages from Django
  useEffect(() => {
    if (lastMessage) {
      const djangoMessage = lastMessage as DjangoMessage;
      
      switch (djangoMessage.type) {
        case 'sensor_data':
          if (djangoMessage.data) {
            const newData: WaterQualityData = {
              id: Date.now(), // Generate an ID for the table
              timestamp: djangoMessage.timestamp || new Date().toISOString(),
              pH: djangoMessage.data.ph || 0,
              temperature: djangoMessage.data.temperature || 0,
              turbidity: djangoMessage.data.turbidity || 0,
              dissolvedOxygen: djangoMessage.data.dissolved_oxygen || 0,
              stationId: djangoMessage.device_id || 'unknown',
              // Add other fields that the table expects
              sensor: djangoMessage.device_id || 'unknown',
              device: djangoMessage.device_id || 'unknown',
              manual_override: false,
              ise: djangoMessage.data.ise || null,
              conductivity: djangoMessage.data.conductivity || null,
              orp: djangoMessage.data.orp || null,
              ec: djangoMessage.data.ec || null,
              value: djangoMessage.data.value || null
            };
            
            setSensorData(prev => {
              const updated = [...prev, newData];
              return updated.slice(-50); // Keep last 50 readings
            });
          }
          break;
          
        case 'device_status':
          if (djangoMessage.device_id) {
            setDeviceStatuses(prev => ({
              ...prev,
              [djangoMessage.device_id!]: djangoMessage.data
            }));
          }
          break;
          
        case 'alert':
          console.log('Received alert from Django:', djangoMessage.data);
          break;
          
        default:
          console.log('Unknown message type from Django:', djangoMessage);
      }
    }
  }, [lastMessage]);

  // Send sensor data to Django
  const sendSensorData = useCallback((deviceId: string, data: Partial<WaterQualityData>) => {
    const message: DjangoMessage = {
      type: 'sensor_data',
      device_id: deviceId,
      data: {
        ph: data.pH,
        temperature: data.temperature,
        turbidity: data.turbidity,
        dissolved_oxygen: data.dissolvedOxygen
      }
    };
    
    return sendMessage(message);
  }, [sendMessage]);

  // Send device status to Django
  const sendDeviceStatus = useCallback((deviceId: string, status: any) => {
    const message: DjangoMessage = {
      type: 'device_status',
      device_id: deviceId,
      data: status
    };
    
    return sendMessage(message);
  }, [sendMessage]);

  // Send commands to Django
  const sendCommand = useCallback((deviceId: string, command: any) => {
    const message: DjangoMessage = {
      type: 'command',
      device_id: deviceId,
      data: command
    };
    
    return sendMessage(message);
  }, [sendMessage]);

  // Send heartbeat
  const sendHeartbeat = useCallback(() => {
    const message: DjangoMessage = {
      type: 'heartbeat',
      data: { timestamp: new Date().toISOString() }
    };
    
    return sendMessage(message);
  }, [sendMessage]);

  return {
    isConnected,
    error,
    sensorData,
    deviceStatuses,
    sendSensorData,
    sendDeviceStatus,
    sendCommand,
    sendHeartbeat
  };
};
