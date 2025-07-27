
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Alert as AlertType } from '@/types/alerts';

interface AlertBannerProps {
  alerts: AlertType[];
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  const criticalAlerts = alerts.filter(a => a.type === 'critical' && !a.acknowledged);
  
  if (criticalAlerts.length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Critical Alerts</AlertTitle>
      <AlertDescription>
        There are {criticalAlerts.length} unacknowledged critical alerts that require your attention.
      </AlertDescription>
    </Alert>
  );
};

export default AlertBanner;
