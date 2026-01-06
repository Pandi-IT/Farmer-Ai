// Centralized API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  ME: '/api/auth/me',

  // Twin endpoints
  ASK_TWIN: '/api/ask-twin',
  ANALYZE_EMOTION: '/api/analyze-emotion',
  ANALYZE_VOICE_EMOTION: '/api/analyze-voice-emotion',
  WHAT_IF_VIEW: '/api/what-if-view',

  // User endpoints
  UPLOAD_PROFILE: '/api/user/upload-profile',

  // Cold storage endpoints
  COLD_STORAGE_SEARCH: '/api/cold-storage/search',
  COLD_STORAGE_ROUTE: '/api/cold-storage/route',

  // Intrusion endpoints
  INTRUSION_REPORT: '/api/intrusion/report',
  INTRUSION_STREAM: '/api/intrusion/stream',
  PUSH_SUBSCRIBE: '/api/push/subscribe',
  VAPID_PUBLIC_KEY: '/api/push/vapid-public-key',

  // Weather endpoints (if they exist)
  WEATHER_CURRENT: '/api/weather/current',
  WEATHER_FORECAST: '/api/weather/forecast',
  WEATHER_ADVICE: '/api/weather/advice',
};

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default API_BASE_URL;
