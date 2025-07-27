
import { useState, useEffect, useRef } from 'react';
import { SensorReading } from '@/types/sensor';
import { getWebSocketUrl } from '@/config/django';

export const useSensorWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);
  const [allReadings, setAllReadings] = useState<SensorReading[]>([]);
  const [error, setError] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUnmountedRef = useRef(false);

  const connect = () => {
    if (isUnmountedRef.current) return;
    
    try {
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to WebSocket:', wsUrl);
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        if (isUnmountedRef.current) return;
        console.log('✅ WebSocket connected to sensor stream');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };
      
      ws.current.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        try {
          const data: SensorReading = JSON.parse(event.data);
          console.log('📡 Received sensor data:', data);
          
          setLatestReading(data);
          
          // Update or add to readings list
          setAllReadings(prev => {
            const existingIndex = prev.findIndex(reading => reading.id === data.id);
            if (existingIndex >= 0) {
              // Update existing reading
              const updated = [...prev];
              updated[existingIndex] = data;
              return updated;
            } else {
              // Add new reading, keep last 100
              return [...prev, data].slice(-100);
            }
          });
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
          setError('Invalid data received from server');
        }
      };
      
      ws.current.onclose = (event) => {
        if (isUnmountedRef.current) return;
        console.log('❌ WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt reconnection with exponential backoff
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`🔄 Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts}) in ${delay}ms`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              connect();
            }
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError('Failed to reconnect to WebSocket after multiple attempts');
        }
      };
      
      ws.current.onerror = (error) => {
        if (isUnmountedRef.current) return;
        console.error('🔴 WebSocket error:', error);
        setError('WebSocket connection failed');
        setIsConnected(false);
      };
    } catch (err) {
      if (isUnmountedRef.current) return;
      setError('Failed to create WebSocket connection');
      console.error('WebSocket creation error:', err);
    }
  };

  useEffect(() => {
    isUnmountedRef.current = false;
    connect();

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close(1000, 'Component unmounting');
      }
    };
  }, []);

  const reconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (ws.current) {
      ws.current.close();
    }
    reconnectAttempts.current = 0;
    setError(null);
    connect();
  };

  return {
    isConnected,
    latestReading,
    allReadings,
    error,
    reconnect
  };
};
