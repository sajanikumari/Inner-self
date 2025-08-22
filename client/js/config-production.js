// API Configuration - PRODUCTION OVERRIDE
// This file forces the use of production backend URL
const API_CONFIG = {
    // Force production backend URL
    BASE_URL: 'https://inner-self-backend.onrender.com/api',
    
    // Endpoints
    ENDPOINTS: {
        AUTH: '/auth',
        DIARY: '/diary',
        REMINDERS: '/reminders',
        TASKS: '/tasks',
        SETTINGS: '/settings',
        CALENDAR: '/calendar'
    }
};

// Log the configuration
console.log('🚀 PRODUCTION API Configuration loaded:');
console.log('  BASE_URL:', API_CONFIG.BASE_URL);
console.log('  Current URL:', window.location.href);

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}