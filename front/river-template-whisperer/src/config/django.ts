
// Django backend configuration
export const DJANGO_CONFIG = {
  // WebSocket URL for real-time data
  WEBSOCKET_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8884/ws/sensors/',
  MAPS_WEBSOCKET_URL: import.meta.env.VITE_WS_MAPS_URL || 'ws://localhost:8884/ws/maps/',
  
  // REST API base URL
  API_BASE_URL: import.meta.env.VITE_DJANGO_API_URL || 'http://localhost:8884/api/',
  
  // Authentication endpoints
  AUTH_ENDPOINTS: {
    LOGIN: 'auth/login/',
    LOGOUT: 'auth/logout/',
    REGISTER: 'auth/register/',
    REFRESH: 'auth/refresh/',
  },
  
  // Data endpoints
  DATA_ENDPOINTS: {
    SENSORS: 'sensors/',
    SCHEMA: 'schema/sensor-reading/',
    DEVICES: 'devices/',
    ALERTS: 'alerts/',
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${DJANGO_CONFIG.API_BASE_URL}${endpoint}`;
};

// Helper function to get WebSocket URL
export const getWebSocketUrl = (): string => {
  return DJANGO_CONFIG.WEBSOCKET_URL;
};

// Helper function to get Map WebSocket URL
export const getMapWebSocketUrl = (): string => {
  return DJANGO_CONFIG.MAPS_WEBSOCKET_URL;
};
