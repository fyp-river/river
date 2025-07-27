
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, RotateCcw } from 'lucide-react';

interface WebSocketStatusIndicatorProps {
  isConnected: boolean;
  error?: string | null;
  onReconnect?: () => void;
}

const WebSocketStatusIndicator: React.FC<WebSocketStatusIndicatorProps> = ({
  isConnected,
  error,
  onReconnect
}) => {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
        {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isConnected ? 'Live' : 'Offline'}
      </Badge>
      
      {error && (
        <span className="text-sm text-destructive">{error}</span>
      )}
      
      {!isConnected && onReconnect && (
        <Button onClick={onReconnect} variant="outline" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reconnect
        </Button>
      )}
    </div>
  );
};

export default WebSocketStatusIndicator;
