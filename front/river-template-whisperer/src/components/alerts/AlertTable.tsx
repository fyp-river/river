
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Info, AlertTriangle, X } from 'lucide-react';
import { Alert } from '@/types/alerts';

interface AlertTableProps {
  alerts: Alert[];
  onAcknowledge: (id: number) => void;
  formatDate: (dateString: string) => string;
}

const AlertTable: React.FC<AlertTableProps> = ({ alerts, onAcknowledge, formatDate }) => {
  // Get alert type badge
  const getAlertBadge = (type: 'info' | 'warning' | 'critical') => {
    switch (type) {
      case 'info':
        return <Badge className="bg-river-blue-light hover:bg-river-blue-light">Info</Badge>;
      case 'warning':
        return <Badge className="bg-river-warning hover:bg-river-warning">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-river-danger hover:bg-river-danger">Critical</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Get alert icon
  const getAlertIcon = (type: 'info' | 'warning' | 'critical') => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-river-blue-light" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-river-warning" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-river-danger" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No alerts found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          There are no alerts matching your current filter.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>Alert</TableHead>
          <TableHead>Station</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {alerts.map((alert) => (
          <TableRow key={alert.id} className={alert.acknowledged ? 'opacity-60' : ''}>
            <TableCell>
              <div className="flex items-center gap-2">
                {getAlertIcon(alert.type)}
                {getAlertBadge(alert.type)}
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">{alert.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{alert.description}</div>
            </TableCell>
            <TableCell>{alert.station}</TableCell>
            <TableCell>{formatDate(alert.timestamp)}</TableCell>
            <TableCell className="text-right">
              {!alert.acknowledged && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAcknowledge(alert.id)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Acknowledge
                </Button>
              )}
              {alert.acknowledged && (
                <span className="text-xs text-muted-foreground">Acknowledged</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AlertTable;
