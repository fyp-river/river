
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';

const WebSocketTestPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [testMessage, setTestMessage] = useState('');
  const djangoWs = useDjangoWebSocket();

  useEffect(() => {
    if (djangoWs.sensorData.length > 0) {
      const latestData = djangoWs.sensorData[djangoWs.sensorData.length - 1];
      setMessages(prev => [...prev, {
        type: 'sensor_data',
        data: latestData,
        timestamp: new Date().toISOString()
      }]);
    }
  }, [djangoWs.sensorData]);

  const sendTestMessage = () => {
    if (testMessage.trim()) {
      djangoWs.sendHeartbeat();
      setMessages(prev => [...prev, {
        type: 'sent',
        data: testMessage,
        timestamp: new Date().toISOString()
      }]);
      setTestMessage('');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WebSocket Test</h1>
          <p className="text-muted-foreground">Test WebSocket connections and messages</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={djangoWs.isConnected ? "default" : "destructive"}>
            {djangoWs.isConnected ? "Connected" : "Disconnected"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>WebSocket connection information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Django WebSocket:</span>
              <Badge variant={djangoWs.isConnected ? "default" : "destructive"}>
                {djangoWs.isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>
            {djangoWs.error && (
              <div className="text-sm text-red-600">
                Error: {djangoWs.error}
              </div>
            )}
            <div className="text-sm text-muted-foreground">
              Sensor Data Count: {djangoWs.sensorData.length}
            </div>
          </CardContent>
        </Card>

        {/* Message Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Send Test Message</CardTitle>
            <CardDescription>Send a test message to the WebSocket</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-message">Message</Label>
              <Textarea
                id="test-message"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                placeholder="Enter a test message..."
              />
            </div>
            <Button onClick={sendTestMessage} disabled={!djangoWs.isConnected}>
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Message Log */}
      <Card>
        <CardHeader>
          <CardTitle>Message Log</CardTitle>
          <CardDescription>Recent WebSocket messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={message.type === 'sent' ? 'default' : 'secondary'}>
                    {message.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <pre className="text-sm bg-muted p-2 rounded overflow-x-auto">
                  {JSON.stringify(message.data, null, 2)}
                </pre>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No messages yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebSocketTestPage;
