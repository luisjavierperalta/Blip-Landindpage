import { apiRequest } from "./queryClient";

// Get API URL from environment variable or fallback to local development
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Debug log to verify API URL
console.log('API URL:', API_URL);

// Configure API request function
export const api = {
  // Example API endpoints
  stats: () => {
    const url = `${API_URL}/api/stats`;
    console.log('Stats API URL:', url);
    return apiRequest('GET', url);
  },
  earlyAccess: (data: any) => {
    const url = `${API_URL}/api/early-access`;
    console.log('Early Access API URL:', url);
    return apiRequest('POST', url, data);
  },
  
  // Add more API endpoints as needed
};

// Export API URL for other uses
export const getApiUrl = () => API_URL; 