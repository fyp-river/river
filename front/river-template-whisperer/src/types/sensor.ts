
// Updated types to match Django backend expectations
export interface FieldInfo {
  name: string;
  type: string;
  required: boolean;
  max_length?: number;
  auto_now?: boolean;
  auto_now_add?: boolean;
}

export interface SensorSchema {
  model: string;
  fields: FieldInfo[];
}

export interface SensorReading {
  [key: string]: any;
  id?: number;
  device_id?: number;
  temperature?: number;
  pH?: number;
  timestamp?: string;
  ise?: number;
  orp?: number;
  tds?: number;
  ec?: number;
  manual_override?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}
