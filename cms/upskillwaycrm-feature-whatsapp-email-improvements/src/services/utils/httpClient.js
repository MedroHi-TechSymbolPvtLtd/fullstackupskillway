import axios from 'axios';

// Prefer explicit VITE_API_URL, fall back to VITE_API_BASE_URL, then to production URL
const baseURL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://65.1.251.7:3000';

const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;