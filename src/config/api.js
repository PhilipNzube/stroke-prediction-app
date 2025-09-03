// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: "http://localhost:5000",
    timeout: 10000,
  },
  production: {
    baseURL: "https://your-backend-name.onrender.com", // Replace with your actual Render URL
    timeout: 15000,
  },
};

// Get current environment
const isDevelopment = import.meta.env.DEV;
const currentConfig = API_CONFIG[isDevelopment ? "development" : "production"];

export const API_BASE_URL = currentConfig.baseURL;
export const API_TIMEOUT = currentConfig.timeout;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Common API endpoints
export const API_ENDPOINTS = {
  PREDICT: "/api/predict",
  HEALTH: "/api/health",
  DOWNLOAD_REPORT: "/api/download-report",
  SHARE_RESULTS: "/api/share-results",
  STATISTICS: "/api/statistics",
  FEATURES: "/api/features",
  MODEL_INFO: "/api/model-info",
};
