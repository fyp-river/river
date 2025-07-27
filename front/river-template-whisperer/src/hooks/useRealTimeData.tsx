import { useState, useEffect, useRef } from 'react';

export interface WaterQualityData {
  timestamp: string;
  pH: number;
  temperature: number;
  turbidity: number;
  dissolvedOxygen: number;
  stationId: string;
}

export const useRealTimeData = (enableRealTime: boolean = true) => {
  const [data, setData] = useState<WaterQualityData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!enableRealTime) return;

    // Simulate WebSocket connection for now
    const simulateRealTimeData = () => {
      const interval = setInterval(() => {
        const newData: WaterQualityData = {
          timestamp: new Date().toISOString(),
          pH: 6.5 + Math.random() * 2, // pH between 6.5-8.5
          temperature: 15 + Math.random() * 10, // temp between 15-25°C
          turbidity: Math.random() * 10, // turbidity 0-10 NTU
          dissolvedOxygen: 5 + Math.random() * 5, // DO 5-10 mg/L
          stationId: `station-${Math.floor(Math.random() * 5) + 1}`
        };

        setData(prevData => {
          const updatedData = [...prevData, newData];
          // Keep only last 50 data points
          return updatedData.slice(-50);
        });
      }, 5000); // Update every 5 seconds

      setIsConnected(true);
      return interval;
    };

    const interval = simulateRealTimeData();

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [enableRealTime]);

  const connect = () => {
    // Future WebSocket connection logic would go here
    console.log('Connecting to real-time data stream...');
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  };

  return {
    data,
    isConnected,
    connect,
    disconnect
  };
};
