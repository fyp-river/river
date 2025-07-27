
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert } from '@/types/alerts';
import AlertSummary from '@/components/alerts/AlertSummary';
import AlertBanner from '@/components/alerts/AlertBanner';
import AlertTable from '@/components/alerts/AlertTable';
import { useSensorWebSocket } from '@/hooks/useSensorWebSocket';
import { useMapWebSocket } from '@/hooks/useMapWebSocket';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Alert as UIAlert, AlertDescription } from '@/components/ui/alert';

const Alerts: React.FC = () => {
  const [alertsList, setAlertsList] = useState<Alert[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // WebSocket connections
  const sensorWs = useSensorWebSocket();
  const mapWs = useMapWebSocket();

  // Generate alerts from sensor data
  useEffect(() => {
    if (sensorWs.allReadings.length > 0) {
      const latestReading = sensorWs.allReadings[sensorWs.allReadings.length - 1];
      const newAlerts: Alert[] = [];

      // Check for critical pH levels
      if (latestReading.pH < 6.0) {
        newAlerts.push({
          id: Date.now() + 1,
          title: 'Critical pH Level',
          type: 'critical',
          station: `Station ${latestReading.stationId}`,
          timestamp: latestReading.timestamp,
          description: `pH levels have fallen below critical threshold. Current: ${latestReading.pH}`,
          acknowledged: false
        });
      } else if (latestReading.pH < 6.5 || latestReading.pH > 8.5) {
        newAlerts.push({
          id: Date.now() + 2,
          title: 'pH Level Warning',
          type: 'warning',
          station: `Station ${latestReading.stationId}`,
          timestamp: latestReading.timestamp,
          description: `pH levels outside normal range. Current: ${latestReading.pH}`,
          acknowledged: false
        });
      }

      // Check for temperature alerts
      if (latestReading.temperature > 25) {
        newAlerts.push({
          id: Date.now() + 3,
          title: 'High Temperature Alert',
          type: 'warning',
          station: `Station ${latestReading.stationId}`,
          timestamp: latestReading.timestamp,
          description: `Water temperature elevated. Current: ${latestReading.temperature}°C`,
          acknowledged: false
        });
      }

      // Check for turbidity alerts
      if (latestReading.turbidity > 10) {
        newAlerts.push({
          id: Date.now() + 4,
          title: 'High Turbidity Detected',
          type: 'critical',
          station: `Station ${latestReading.stationId}`,
          timestamp: latestReading.timestamp,
          description: `Turbidity levels critical. Current: ${latestReading.turbidity} NTU`,
          acknowledged: false
        });
      } else if (latestReading.turbidity > 5) {
        newAlerts.push({
          id: Date.now() + 5,
          title: 'Elevated Turbidity',
          type: 'warning',
          station: `Station ${latestReading.stationId}`,
          timestamp: latestReading.timestamp,
          description: `Turbidity levels elevated. Current: ${latestReading.turbidity} NTU`,
          acknowledged: false
        });
      }

      // Check for dissolved oxygen alerts
      if (latestReading.dissolvedOxygen < 4) {
        newAlerts.push({
          id: Date.now() + 6,
          title: 'Critical Dissolved Oxygen',
          type: 'critical',
          station: `Station ${latestReading.stationId}`,
          timestamp: latestReading.timestamp,
          description: `Dissolved oxygen critically low. Current: ${latestReading.dissolvedOxygen} mg/L`,
          acknowledged: false
        });
      } else if (latestReading.dissolvedOxygen < 6) {
        newAlerts.push({
          id: Date.now() + 7,
          title: 'Low Dissolved Oxygen',
          type: 'warning',
          station: `Station ${latestReading.stationId}`,
          timestamp: latestReading.timestamp,
          description: `Dissolved oxygen below optimal. Current: ${latestReading.dissolvedOxygen} mg/L`,
          acknowledged: false
        });
      }

      // Update alerts list, avoiding duplicates
      if (newAlerts.length > 0) {
        setAlertsList(prev => {
          const existing = prev.filter(alert => 
            !newAlerts.some(newAlert => 
              newAlert.title === alert.title && 
              newAlert.station === alert.station &&
              Math.abs(new Date(newAlert.timestamp).getTime() - new Date(alert.timestamp).getTime()) < 60000 // Within 1 minute
            )
          );
          return [...existing, ...newAlerts].slice(-50); // Keep last 50 alerts
        });
      }
    }
  }, [sensorWs.allReadings]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Filter alerts based on active tab
  const filteredAlerts = alertsList.filter(alert => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unacknowledged') return !alert.acknowledged;
    return alert.type === activeTab;
  });

  // Acknowledge an alert
  const acknowledgeAlert = (id: number) => {
    setAlertsList(prev => 
      prev.map(alert => 
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  // Connection status
  const isConnected = sensorWs.isConnected || mapWs.isConnected;
  const hasError = sensorWs.error || mapWs.error;

  return (
    <div className="flex min-h-screen flex-col bg-river">
      <Header />
      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-river-foreground">Alerts</h1>
              <p className="text-muted-foreground">Real-time alerts from sensor monitoring</p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isConnected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <span className="text-sm">
                  {isConnected ? 'Live Data' : 'Offline'}
                </span>
              </div>
              
              <Button
                onClick={() => {
                  sensorWs.reconnect();
                  mapWs.reconnect();
                }}
                variant="outline"
                size="sm"
                disabled={isConnected}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reconnect
              </Button>
            </div>
          </div>

          {/* Connection Error Alert */}
          {hasError && (
            <UIAlert variant="destructive" className="mb-6">
              <AlertDescription>
                WebSocket Error: {sensorWs.error || mapWs.error}
              </AlertDescription>
            </UIAlert>
          )}

          {/* No Data Alert */}
          {!isConnected && alertsList.length === 0 && (
            <UIAlert className="mb-6">
              <AlertDescription>
                No alerts available. Connect to the backend to receive real-time alerts from sensor readings.
              </AlertDescription>
            </UIAlert>
          )}
          
          {/* Summary Cards */}
          <AlertSummary alerts={alertsList} />
          
          {/* Critical Alert Banner */}
          <AlertBanner alerts={alertsList} />
          
          <Card className="river-card">
            <CardHeader className="pb-4">
              <CardTitle>Alert Center</CardTitle>
              <CardDescription>
                Real-time alerts generated from sensor data and system monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-8">
                  <TabsTrigger value="all">All ({alertsList.length})</TabsTrigger>
                  <TabsTrigger value="critical">
                    Critical ({alertsList.filter(a => a.type === 'critical').length})
                  </TabsTrigger>
                  <TabsTrigger value="warning">
                    Warning ({alertsList.filter(a => a.type === 'warning').length})
                  </TabsTrigger>
                  <TabsTrigger value="info">
                    Info ({alertsList.filter(a => a.type === 'info').length})
                  </TabsTrigger>
                  <TabsTrigger value="unacknowledged">
                    Unack. ({alertsList.filter(a => !a.acknowledged).length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab}>
                  <AlertTable 
                    alerts={filteredAlerts}
                    onAcknowledge={acknowledgeAlert}
                    formatDate={formatDate}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
