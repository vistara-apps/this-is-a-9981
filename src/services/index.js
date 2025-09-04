// API Services Index
// Centralized export for all API services

export { default as AlchemyService } from './AlchemyService';
export { default as SupabaseService } from './SupabaseService';
export { default as TurnkeyService } from './TurnkeyService';
export { default as PinataService } from './PinataService';
export { default as OpenAIService } from './OpenAIService';

// Service configuration
export const API_CONFIG = {
  // Environment-based configuration
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // API endpoints
  endpoints: {
    alchemy: import.meta.env.VITE_ALCHEMY_API_URL || 'https://eth-mainnet.g.alchemy.com/v2',
    supabase: import.meta.env.VITE_SUPABASE_URL || '',
    turnkey: import.meta.env.VITE_TURNKEY_API_URL || 'https://api.turnkey.com',
    pinata: import.meta.env.VITE_PINATA_API_URL || 'https://api.pinata.cloud',
    openai: import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1',
  },
  
  // API keys (should be set via environment variables)
  apiKeys: {
    alchemy: import.meta.env.VITE_ALCHEMY_API_KEY,
    supabase: import.meta.env.VITE_SUPABASE_ANON_KEY,
    turnkey: import.meta.env.VITE_TURNKEY_API_KEY,
    pinata: import.meta.env.VITE_PINATA_API_KEY,
    openai: import.meta.env.VITE_OPENAI_API_KEY,
  },
  
  // Request configuration
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Common error types
export const API_ERRORS = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// Utility function for handling API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 401:
        return { type: API_ERRORS.AUTHENTICATION_ERROR, message: 'Authentication failed' };
      case 429:
        return { type: API_ERRORS.RATE_LIMIT_ERROR, message: 'Rate limit exceeded' };
      case 400:
        return { type: API_ERRORS.VALIDATION_ERROR, message };
      case 500:
      case 502:
      case 503:
        return { type: API_ERRORS.SERVER_ERROR, message: 'Server error occurred' };
      default:
        return { type: API_ERRORS.UNKNOWN_ERROR, message };
    }
  } else if (error.request) {
    // Network error
    return { type: API_ERRORS.NETWORK_ERROR, message: 'Network connection failed' };
  } else if (error.code === 'ECONNABORTED') {
    // Timeout error
    return { type: API_ERRORS.TIMEOUT_ERROR, message: 'Request timeout' };
  } else {
    // Unknown error
    return { type: API_ERRORS.UNKNOWN_ERROR, message: error.message };
  }
};

// Retry utility function
export const retryRequest = async (requestFn, maxAttempts = API_CONFIG.retryAttempts) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication or validation errors
      const errorInfo = handleApiError(error);
      if (errorInfo.type === API_ERRORS.AUTHENTICATION_ERROR || 
          errorInfo.type === API_ERRORS.VALIDATION_ERROR) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      if (attempt < maxAttempts) {
        const delay = API_CONFIG.retryDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};
