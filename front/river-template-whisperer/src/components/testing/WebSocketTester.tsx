
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Wifi, 
  WifiOff, 
  Send, 
  Trash2, 
  Activity, 
  MessageSquare,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useWebSocketTesting, TestMessage } from '@/hooks/useWebSocketTesting';

const WebSocketTester: React.FC = () => {
  const { 
    isConnected, 
    connectionState, 
    messages, 
    error, 
    sendTestMessage, 
    sendPing, 
    clearMessages,
    reconnect
  } = useWebSocketTesting();
  
  const [testInput, setTestInput] = useState('Hello from frontend!');

  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected': return 'default';
      case 'connecting': return 'secondary';
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const formatMessage = (message: TestMessage) => {
    return {
      ...message,
      displayTime: new Date(message.timestamp).toLocaleTimeString()
    };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                WebSocket Connection Tester
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Test bidirectional WebSocket communication with Django backend
              </CardDescription>
            </div>
            <Badge variant={getStatusColor()} className="flex items-center gap-1 w-fit">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {connectionState}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-xs sm:text-sm text-destructive">{error}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <Button 
              onClick={() => sendTestMessage(testInput)} 
              disabled={!isConnected}
              className="flex items-center gap-2 text-xs sm:text-sm"
              size="sm"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Send Test</span>
              <span className="xs:hidden">Send</span>
            </Button>
            
            <Button 
              onClick={sendPing} 
              disabled={!isConnected}
              variant="outline"
              className="flex items-center gap-2 text-xs sm:text-sm"
              size="sm"
            >
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Send Ping</span>
              <span className="xs:hidden">Ping</span>
            </Button>
            
            <Button 
              onClick={reconnect} 
              variant="outline"
              className="flex items-center gap-2 text-xs sm:text-sm"
              size="sm"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Reconnect</span>
              <span className="xs:hidden">Retry</span>
            </Button>
            
            <Button 
              onClick={clearMessages} 
              variant="outline"
              className="flex items-center gap-2 text-xs sm:text-sm"
              size="sm"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              Clear
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-medium">Test Message:</label>
            <Input
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="Enter test message to send..."
              className="text-xs sm:text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && isConnected) {
                  sendTestMessage(testInput);
                }
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            Message Log ({messages.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] sm:h-[400px] w-full rounded-md border p-3 sm:p-4">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-xs sm:text-sm">
                No messages yet. Send a test message to begin.
              </p>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => {
                  const formatted = formatMessage(message);
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {message.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatted.displayTime}
                        </span>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-2 sm:p-3">
                        <pre className="text-xs whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(message.data, null, 2)}
                        </pre>
                      </div>
                      {index < messages.length - 1 && <Separator />}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebSocketTester;
