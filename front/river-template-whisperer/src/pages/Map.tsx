
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, MapPin, Navigation, Zap, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import RiverMapView from '@/components/maps/RiverMapView';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';

const Map = () => {
  const { isConnected, mapData, error, sendMessage, reconnect } = useMapWebSocket();

  const handleTestMessage = () => {
    const success = sendMessage({
      type: 'test',
      message: 'Test message from map page',
      timestamp: new Date().toISOString()
    });
    
    if (!success && !isConnected) {
      // Show user feedback for failed message
      console.warn('Message failed to send - WebSocket not connected');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-river">
      <Header />
      <main className="flex-1 p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button onClick={reconnect} variant="outline" size="sm" className="ml-2">
                Reconnect
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col xl:flex-row gap-4 items-start">
          <div className="w-full xl:w-3/4">
            <Card className="river-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2 flex-wrap">
                  <Navigation className="h-4 w-4 sm:h-5 sm:w-5 text-river-purple-light flex-shrink-0" />
                  <span className="flex-1 min-w-0">River Monitoring Map</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Zap className={`h-4 w-4 ${isConnected ? 'text-river-success' : 'text-river-danger'}`} />
                    <span className="text-xs sm:text-sm">
                      {isConnected ? 'Live Data' : 'Offline'}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] w-full">
                  <RiverMapView />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full xl:w-1/4 space-y-4">
            <Card className="river-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Info className="h-4 w-4 text-river-blue-light" />
                  Map Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-river-success flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">Normal water quality</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-river-warning flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">Warning levels detected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-river-danger flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm">Critical conditions</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-river-purple-light flex-shrink-0" />
                  <span className="text-xs sm:text-sm">Monitoring station</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="river-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-river-purple-light" />
                  Active Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[150px] sm:max-h-[200px] md:max-h-[300px] overflow-y-auto pr-2">
                  {['Station Alpha', 'Station Beta', 'Station Gamma', 'Station Delta', 'Station Epsilon'].map((station, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors">
                      <span className="text-xs sm:text-sm truncate">{station}</span>
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${index === 4 ? 'bg-river-danger' : index === 2 ? 'bg-river-warning' : 'bg-river-success'}`}></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="river-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">WebSocket Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleTestMessage}
                  className="w-full text-xs sm:text-sm px-3 py-2 bg-river-blue-light text-white rounded hover:bg-river-blue-light/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isConnected}
                  size="sm"
                >
                  Send Test Message
                </Button>
                <div className="space-y-2 text-xs">
                  <div className="text-muted-foreground">
                    Messages received: {mapData.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                  </div>
                  {error && (
                    <div className="text-red-500 text-xs break-words">
                      Error: {error}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Map;
