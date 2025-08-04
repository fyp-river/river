
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useDjangoWebSocket } from '@/hooks/useDjangoWebSocket';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info' | 'success';
  title: string;
  description: string;
  timestamp: string;
  device?: string;
  resolved: boolean;
}

const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const djangoWs = useDjangoWebSocket();

  // Simulate alerts based on sensor data
  useEffect(() => {
    if (djangoWs.sensorData.length > 0) {
      const latestData = djangoWs.sensorData[djangoWs.sensorData.length - 1];
      const newAlerts: Alert[] = [];

      // Check for water quality issues
      if (latestData.pH < 6.5 || latestData.pH > 8.5) {
        newAlerts.push({
          id: `ph-${Date.now()}`,
          type: 'warning',
          title: 'pH Level Alert',
          description: `pH level is ${latestData.pH.toFixed(2)}, which is outside the normal range (6.5-8.5)`,
          timestamp: latestData.timestamp,
          device: latestData.stationId,
          resolved: false
        });
      }

      if (latestData.dissolvedOxygen < 6.0) {
        newAlerts.push({
          id: `do-${Date.now()}`,
          type: 'error',
          title: 'Low Dissolved Oxygen',
          description: `Dissolved oxygen level is ${latestData.dissolvedOxygen.toFixed(2)} mg/L, which is below the safe threshold`,
          timestamp: latestData.timestamp,
          device: latestData.stationId,
          resolved: false
        });
      }

      if (latestData.turbidity > 10) {
        newAlerts.push({
          id: `turbidity-${Date.now()}`,
          type: 'warning',
          title: 'High Turbidity',
          description: `Turbidity level is ${latestData.turbidity.toFixed(2)} NTU, which indicates poor water clarity`,
          timestamp: latestData.timestamp,
          device: latestData.stationId,
          resolved: false
        });
      }

      // Add new alerts to the list
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50)); // Keep last 50 alerts
    }
  }, [djangoWs.sensorData]);

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'active') return !alert.resolved;
    if (filter === 'resolved') return alert.resolved;
    return true;
  });

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const getAlertBadgeVariant = (type: Alert['type']) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'success': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts</h1>
          <p className="text-muted-foreground">Monitor water quality alerts and notifications</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={djangoWs.isConnected ? "default" : "destructive"}>
            {djangoWs.isConnected ? "Live" : "Offline"}
          </Badge>
        </div>
      </div>

      {/* Connection Status */}
      {!djangoWs.isConnected && (
        <Alert variant="destructive">
          <AlertDescription>
            WebSocket connection is offline. Alerts may not be real-time.
          </AlertDescription>
        </Alert>
      )}

      {/* Filter Controls */}
      <div className="flex gap-2">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({alerts.length})
        </Button>
        <Button 
          variant={filter === 'active' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('active')}
        >
          Active ({alerts.filter(a => !a.resolved).length})
        </Button>
        <Button 
          variant={filter === 'resolved' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('resolved')}
        >
          Resolved ({alerts.filter(a => a.resolved).length})
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className={alert.resolved ? 'opacity-60' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getAlertIcon(alert.type)}
                  <div>
                    <CardTitle className="text-lg">{alert.title}</CardTitle>
                    <CardDescription>
                      {new Date(alert.timestamp).toLocaleString()}
                      {alert.device && ` • Device: ${alert.device}`}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getAlertBadgeVariant(alert.type)}>
                    {alert.type}
                  </Badge>
                  {alert.resolved && (
                    <Badge variant="outline">Resolved</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {alert.description}
              </p>
              <div className="flex gap-2">
                {!alert.resolved && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => resolveAlert(alert.id)}
                  >
                    Mark Resolved
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteAlert(alert.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No alerts found</p>
            <p className="text-sm">Alerts will appear here when water quality issues are detected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
