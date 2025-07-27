
import { useEffect, useRef, useState } from 'react';
import { getMapWebSocketUrl } from '../config/django';

export const useMapWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mapData, setMapData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isUnmountedRef = useRef(false);

  const connect = () => {
    if (isUnmountedRef.current) return;
    
    try {
      const wsUrl = getMapWebSocketUrl();
      console.log('[Map WebSocket] Connecting to:', wsUrl);
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        if (isUnmountedRef.current) return;
        console.log('[Map WebSocket] Connected to maps endpoint');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        
        socket.send(JSON.stringify({ 
          type: 'init', 
          message: 'Hello from frontend (maps)',
          timestamp: new Date().toISOString()
        }));
      };

      socket.onmessage = (event) => {
        if (isUnmountedRef.current) return;
        console.log('[Map WebSocket] Received from server:', event.data);
        try {
          const data = JSON.parse(event.data);
          setMapData(prev => [...prev.slice(-49), data]); // Keep last 50 messages
        } catch (parseError) {
          console.error('[Map WebSocket] Error parsing message:', parseError);
          setError('Failed to parse server message');
        }
      };

      socket.onerror = (error) => {
        if (isUnmountedRef.current) return;
        console.error('[Map WebSocket] Error:', error);
        setIsConnected(false);
        setError('WebSocket connection error');
      };

      socket.onclose = (event) => {
        if (isUnmountedRef.current) return;
        console.log('[Map WebSocket] Connection closed:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect with exponential backoff
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`[Map WebSocket] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (!isUnmountedRef.current) {
              connect();
            }
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          setError('Failed to reconnect after multiple attempts');
        }
      };

    } catch (err) {
      if (isUnmountedRef.current) return;
      console.error('[Map WebSocket] Failed to create connection:', err);
      setError('Failed to create WebSocket connection');
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
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, 'Component unmounting');
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        socketRef.current.send(JSON.stringify(message));
        console.log('[Map WebSocket] Sent message:', message);
        return true;
      } catch (err) {
        console.error('[Map WebSocket] Error sending message:', err);
        setError('Failed to send message');
        return false;
      }
    } else {
      console.warn('[Map WebSocket] Cannot send message - connection not open');
      setError('WebSocket not connected');
      return false;
    }
  };

  const reconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
    reconnectAttempts.current = 0;
    setError(null);
    connect();
  };

  return {
    isConnected,
    mapData,
    error,
    sendMessage,
    reconnect,
    socket: socketRef.current
  };
};
