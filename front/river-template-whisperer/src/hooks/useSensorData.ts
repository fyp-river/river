
import { useState, useEffect } from 'react';
import { SensorService } from '@/services/sensorService';
import { SensorSchema, SensorReading } from '@/types/sensor';

export const useSensorData = () => {
  const [schema, setSchema] = useState<SensorSchema | null>(null);
  const [sensors, setSensors] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch schema first
      const schemaResponse = await SensorService.fetchSchema();
      if (schemaResponse.error) {
        throw new Error(schemaResponse.error);
      }
      setSchema(schemaResponse.data);

      // Then fetch sensor data
      const sensorsResponse = await SensorService.fetchSensors();
      if (sensorsResponse.error) {
        throw new Error(sensorsResponse.error);
      }
      setSensors(sensorsResponse.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    schema,
    sensors,
    loading,
    error,
    refetch
  };
};
