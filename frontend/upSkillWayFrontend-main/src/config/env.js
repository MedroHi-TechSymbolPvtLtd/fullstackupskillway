/**
 * Environment Configuration
 */

const config = {
  // Always use environment variable for API base URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

  // Environment info
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

// Validate environment
const validateConfig = () => {
  if (!config.apiBaseUrl) {
    console.warn("⚠️ Missing VITE_API_BASE_URL! API calls will fail.");
  }
};

validateConfig();

export default config;
