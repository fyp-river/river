
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SensorSchema, SensorReading } from '@/types/sensor';

interface SensorTableProps {
  schema: SensorSchema;
  readings: SensorReading[];
  latestReading?: SensorReading | null;
}

const SensorTable: React.FC<SensorTableProps> = ({ schema, readings, latestReading }) => {
  const formatValue = (value: any, fieldType: string): string => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    // Format based on field type
    switch (fieldType) {
      case 'DecimalField':
      case 'FloatField':
        return typeof value === 'number' ? value.toFixed(2) : String(value);
      case 'DateTimeField':
        return value ? new Date(value).toLocaleString() : '-';
      case 'BooleanField':
        return value ? 'Yes' : 'No';
      default:
        return String(value);
    }
  };

  const formatHeader = (fieldName: string): string => {
    return fieldName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get display fields (exclude auto fields like auto_now, auto_now_add)
  const displayFields = schema.fields.filter(field => 
    !field.auto_now && !field.auto_now_add
  );

  if (!schema.fields || schema.fields.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No schema available
      </div>
    );
  }

  // Combine all readings with latest at top if it's new
  const allData = latestReading ? [latestReading, ...readings.filter(r => r.id !== latestReading.id)] : readings;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {displayFields.map((field) => (
              <TableHead key={field.name}>
                {formatHeader(field.name)}
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
                    {formatValue(reading[field.name], field.type)}
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
