// API Configuration
const API_CONFIG = {
    // Detect environment and use appropriate backend URL
    BASE_URL: (() => {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        console.log('🔍 Environment Detection:');
        console.log('  Hostname:', hostname);
        console.log('  Protocol:', protocol);
        console.log('  Full URL:', window.location.href);
        
        // TEMPORARY: Force production backend for testing
        // TODO: Remove this override once testing is complete
        if (false) { // Disable forced production mode
            console.log('🔧 FORCING production backend for testing');
            return 'https://inner-self-backend.onrender.com/api';
        }
        
        // Check if we're on GitHub Pages or production
        if (hostname.includes('github.io') || 
            hostname === 'sajanikumari.github.io' ||
            protocol === 'https:' && hostname !== 'localhost') {
            console.log('✅ Detected production environment - using Render backend');
            // Production backend URL - LIVE BACKEND
            return 'https://inner-self-backend.onrender.com/api';
        }
        
        console.log('🔧 Detected development environment - using local backend');
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

// Log the final configuration
console.log('🚀 API Configuration loaded:');
console.log('  BASE_URL:', API_CONFIG.BASE_URL);

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return API_CONFIG.BASE_URL + endpoint;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
