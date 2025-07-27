
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Bell } from 'lucide-react';
import { Alert } from '@/types/alerts';

interface AlertSummaryProps {
  alerts: Alert[];
}

const AlertSummary: React.FC<AlertSummaryProps> = ({ alerts }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="river-card">
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
            <h3 className="text-2xl font-bold text-river-danger">
              {alerts.filter(a => a.type === 'critical' && !a.acknowledged).length}
            </h3>
          </div>
          <div className="rounded-full bg-river-danger/10 p-2 text-river-danger">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="river-card">
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Warning Alerts</p>
            <h3 className="text-2xl font-bold text-river-warning">
              {alerts.filter(a => a.type === 'warning' && !a.acknowledged).length}
            </h3>
          </div>
          <div className="rounded-full bg-river-warning/10 p-2 text-river-warning">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="river-card">
        <CardContent className="flex items-center justify-between pt-6">
          <div className="flex flex-col">
            <p className="text-sm font-medium text-muted-foreground">Info Notifications</p>
            <h3 className="text-2xl font-bold text-river-blue-light">
              {alerts.filter(a => a.type === 'info' && !a.acknowledged).length}
            </h3>
          </div>
          <div className="rounded-full bg-river-blue-light/10 p-2 text-river-blue-light">
            <Bell className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertSummary;
