/**
 * API Configuration
 * Centralized base URL for all API calls
 */
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";

export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  // Remove trailing slash from base URL if present
  const cleanBaseUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  return `${cleanBaseUrl}/${cleanEndpoint}`;
};

export default API_BASE_URL;
