
import { SensorSchema, SensorReading, ApiResponse } from '@/types/sensor';
import { getApiUrl } from '@/config/django';

export class SensorService {
  static async fetchSchema(): Promise<ApiResponse<SensorSchema>> {
    try {
      const response = await fetch(getApiUrl('schema/sensor-reading/'));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('Failed to fetch sensor schema:', error);
      return { 
        data: { model: '', fields: [] }, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  static async fetchSensors(): Promise<ApiResponse<SensorReading[]>> {
    try {
      const response = await fetch(getApiUrl('sensors/'));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Failed to fetch sensors:', error);
      return { 
        data: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}
