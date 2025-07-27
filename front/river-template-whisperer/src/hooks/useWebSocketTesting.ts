
import { useState, useEffect, useRef, useCallback } from 'react';
import { getWebSocketUrl } from '@/config/django';

export interface TestMessage {
  type: 'test' | 'echo' | 'sensor_data' | 'ping';
  data: any;
  timestamp: string;
  message_id?: string;
}

export const useWebSocketTesting = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [messages, setMessages] = useState<TestMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000;

  const connect = useCallback(() => {
    try {
      const wsUrl = getWebSocketUrl();
      console.log('🔌 Attempting WebSocket connection to:', wsUrl);
      
      setConnectionState('connecting');
      setError(null);
      
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        console.log('✅ WebSocket connection established successfully');
        console.log('📡 Connection details:', {
          url: wsUrl,
          protocol: ws.current?.protocol,
          readyState: ws.current?.readyState,
          timestamp: new Date().toISOString()
        });
        
        setIsConnected(true);
        setConnectionState('connected');
        reconnectAttempts.current = 0;
        
        // Send initial test message after connection
        setTimeout(() => {
          sendTestMessage('Connection established from frontend');
        }, 500);
      };
      
      ws.current.onmessage = (event) => {
        console.log('📨 Received WebSocket message:', {
          data: event.data,
          timestamp: new Date().toISOString(),
          origin: event.origin
        });
        
        try {
          const message: TestMessage = JSON.parse(event.data);
          console.log('📋 Parsed message:', message);
          
          setMessages(prev => [...prev, message].slice(-50)); // Keep last 50 messages
          
          // Auto-respond to ping messages
          if (message.type === 'ping') {
            console.log('🏓 Received ping, sending pong...');
            sendMessage({
              type: 'echo',
              data: { response: 'pong', original_message_id: message.message_id },
              timestamp: new Date().toISOString()
            });
          }
        } catch (err) {
          console.error('❌ Failed to parse WebSocket message:', err);
          console.error('Raw message data:', event.data);
          setError('Invalid data received from server');
        }
      };
      
      ws.current.onclose = (event) => {
        console.log('❌ WebSocket connection closed:', {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString()
        });
        
        setIsConnected(false);
        setConnectionState('disconnected');
        
        // Attempt reconnection
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`🔄 Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else {
          setError('Failed to reconnect after multiple attempts');
        }
      };
      
      ws.current.onerror = (error) => {
        console.error('🔴 WebSocket error occurred:', {
          error,
          timestamp: new Date().toISOString(),
          readyState: ws.current?.readyState
        });
        setError('WebSocket connection failed');
        setConnectionState('error');
      };
      
    } catch (err) {
      console.error('💥 Failed to create WebSocket connection:', err);
      setError('Failed to create WebSocket connection');
      setConnectionState('error');
    }
  }, []);

  const sendMessage = useCallback((message: TestMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        const messageWithId = {
          ...message,
          message_id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        };
        
        const messageString = JSON.stringify(messageWithId);
        ws.current.send(messageString);
        
        console.log('📤 Sent WebSocket message:', {
          message: messageWithId,
          size: messageString.length,
          timestamp: new Date().toISOString()
        });
        
        return true;
      } catch (err) {
        console.error('❌ Failed to send WebSocket message:', err);
        setError('Failed to send message');
        return false;
      }
    } else {
      console.warn('⚠️ WebSocket is not connected. Current state:', ws.current?.readyState);
      setError('WebSocket is not connected');
      return false;
    }
  }, []);

  const sendTestMessage = useCallback((testData: string) => {
    console.log('🧪 Sending test message:', testData);
    return sendMessage({
      type: 'test',
      data: { 
        message: testData,
        frontend_timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
      },
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  const sendPing = useCallback(() => {
    console.log('🏓 Sending ping...');
    return sendMessage({
      type: 'ping',
      data: { ping: true },
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    console.log('🧹 Cleared message history');
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        console.log('🔌 Cleaning up WebSocket connection');
        ws.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    connectionState,
    messages,
    error,
    sendMessage,
    sendTestMessage,
    sendPing,
    clearMessages,
    reconnect: connect
  };
};
