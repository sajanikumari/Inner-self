// Deployment status checker
const PRODUCTION_API = 'https://inner-self-backend.onrender.com/api';

async function checkDeploymentStatus() {
    console.log('🔍 Checking deployment status...\n');

    try {
        // Test the health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch('https://inner-self-backend.onrender.com/');
        const healthText = await healthResponse.text();
        console.log('✅ Health check:', healthText);

        // Test auth endpoint with a dummy login to see the response
        console.log('\n2. Testing auth endpoint response format...');
        const authResponse = await fetch(`${PRODUCTION_API}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'dummy@test.com',
                password: 'dummy'
            })
        });

        const authResult = await authResponse.json();
        console.log('📦 Auth response:', authResult);

        // Check if it's still the old mock response
        if (authResult.message && authResult.message.includes('authentication logic needed')) {
            console.log('❌ DEPLOYMENT NOT UPDATED - Still showing mock response');
            console.log('💡 The deployment may still be in progress or failed');
            console.log('🔄 Please check Render dashboard for deployment status');
        } else if (authResult.message && authResult.message.includes('Invalid email or password')) {
            console.log('✅ DEPLOYMENT UPDATED - Real authentication is working!');
            console.log('🎉 The backend now has proper user authentication');
        } else {
            console.log('⚠️  Unexpected response format');
            console.log('🔍 Please check the response above');
        }

        // Test a protected route to verify auth middleware
        console.log('\n3. Testing protected route...');
        const protectedResponse = await fetch(`${PRODUCTION_API}/auth/me`, {
            headers: {
                'Authorization': 'Bearer invalid-token'
            }
        });

        const protectedResult = await protectedResponse.json();
        console.log('🔒 Protected route response:', protectedResult);

        if (protectedResult.message && protectedResult.message.includes('No token provided')) {
            console.log('✅ Auth middleware is working correctly');
        }

    } catch (error) {
        console.error('❌ Error checking deployment:', error.message);
        console.log('🔄 The service might be starting up or experiencing issues');
    }
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
    global.fetch = require('node-fetch');
}

checkDeploymentStatus();