// API Configuration
const API_CONFIG = {
    // Use localhost:5000 for development
    BASE_URL: 'http://localhost:5000/api',
    
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

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
