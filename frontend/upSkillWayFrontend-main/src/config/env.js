/**
 * Environment Configuration
 * Centralized access to environment variables
 * All environment variables must be prefixed with VITE_ to be accessible in the browser
 */

const config = {
  // API Configuration
  // Use VITE_API_BASE_URL in production. Fallback to the provided production API URL.
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://65.1.251.7:3000/api/v1',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  mode: import.meta.env.MODE,
};

// Validate required environment variables
const validateConfig = () => {
  const required = ['apiBaseUrl'];
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.warn(
      `Missing environment variables: ${missing.join(', ')}. Using default values.`
    );
  }
};

validateConfig();

export default config;
