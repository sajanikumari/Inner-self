// API Configuration
const API_CONFIG = {
    // Detect environment and use appropriate backend URL
    BASE_URL: (() => {
        // Check if we're on GitHub Pages or production
        if (window.location.hostname.includes('github.io') || 
            window.location.hostname.includes('sajanikumari.github.io')) {
            // Production backend URL - LIVE BACKEND
            return 'https://inner-self-backend.onrender.com/api';
        }
        // Development - local backend
        return 'http://localhost:5000/api';
    })(),
    
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
