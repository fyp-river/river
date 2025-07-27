
// Type definition for alert objects
export type Alert = {
  id: number;
  title: string;
  type: 'info' | 'warning' | 'critical';
  station: string;
  timestamp: string;
  description: string;
  acknowledged: boolean;
};

// Mock data for alerts - ensuring each alert has the correct type
export const alertsData: Alert[] = [
  {
    id: 1,
    title: 'High Turbidity Detected',
    type: 'warning',
    station: 'Station Gamma',
    timestamp: '2025-04-03T08:23:45',
    description: 'Turbidity levels have exceeded warning threshold of 10 NTU',
    acknowledged: false
  },
  {
    id: 2,
    title: 'Critical pH Level',
    type: 'critical',
    station: 'Station Epsilon',
    timestamp: '2025-04-03T07:14:22',
    description: 'pH levels have fallen below critical threshold of 6.0',
    acknowledged: false
  },
  {
    id: 3,
    title: 'Dissolved Oxygen Warning',
    type: 'warning',
    station: 'Station Beta',
    timestamp: '2025-04-02T22:45:10',
    description: 'Dissolved oxygen levels have dropped below 5mg/L',
    acknowledged: true
  },
  {
    id: 4,
    title: 'System Maintenance',
    type: 'info',
    station: 'All Stations',
    timestamp: '2025-04-01T15:30:00',
    description: 'Scheduled system maintenance will occur on April 10th from 02:00-04:00 UTC',
    acknowledged: true
  },
  {
    id: 5,
    title: 'Critical Flow Rate',
    type: 'critical',
    station: 'Station Alpha',
    timestamp: '2025-04-03T05:12:33',
    description: 'Water flow rate has increased to critical levels of 120 m³/s',
    acknowledged: false
  }
];
