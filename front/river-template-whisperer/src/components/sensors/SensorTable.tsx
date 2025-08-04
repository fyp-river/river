
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SensorSchema, SensorReading } from '@/types/sensor';

interface SensorTableProps {
  schema: SensorSchema;
  readings: SensorReading[];
  latestReading?: SensorReading | null;
}

const SensorTable: React.FC<SensorTableProps> = ({ schema, readings, latestReading }) => {
  const formatValue = (value: any): string => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    // Format numbers to max 4 decimal places
    if (typeof value === 'number') {
      return value.toFixed(Math.min(4, (value.toString().split('.')[1] || '').length));
    }
    
    return String(value);
  };

  // Define the fields we want to display
  const displayFields = [
    { name: 'pH', label: 'pH Level', key: 'pH' },
    { name: 'Turbidity', label: 'Turbidity (NTU)', key: 'turbidity' },
    { name: 'Conductivity', label: 'Conductivity (µS/cm)', key: 'conductivity' },
    { name: 'Cyanide', label: 'Cyanide (mg/L)', key: 'ise' },
    { name: 'Mercury Level', label: 'Mercury Level (mg/L)', key: 'value' },
    { name: 'Device', label: 'Device', key: 'device' },
    { name: 'Timestamp', label: 'Timestamp', key: 'timestamp' }
  ];

  // Combine all readings with latest at top if it's new
  const allData = latestReading ? [latestReading, ...readings.filter(r => r.id !== latestReading.id)] : readings;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {displayFields.map((field) => (
              <TableHead key={field.name}>
                {field.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allData.length === 0 ? (
            <TableRow>
              <TableCell 
                colSpan={displayFields.length} 
                className="text-center py-8 text-muted-foreground"
              >
                No sensor data available
              </TableCell>
            </TableRow>
          ) : (
            allData.map((reading, index) => (
              <TableRow 
                key={reading.id || index}
                className={index === 0 && latestReading?.id === reading.id ? 'bg-muted/50' : ''}
              >
                {displayFields.map((field) => (
                  <TableCell key={field.name}>
                    {field.key === 'timestamp' 
                      ? (reading[field.key] ? new Date(reading[field.key]).toLocaleString() : '-')
                      : formatValue(reading[field.key])
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SensorTable;
