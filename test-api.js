// Simple API test script
const API_BASE = 'http://localhost:5000/api';

async function testAPI() {
    console.log('🧪 Testing InnerSelf API...\n');

    try {
        // Test 1: Health check
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch('http://localhost:5000/');
        const healthText = await healthResponse.text();
        console.log('✅ Health check:', healthText);

        // Test 2: Register a test user
        console.log('\n2. Testing user registration...');
        const registerData = {
            name: 'Test User',
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123'
        };

        const registerResponse = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registerData)
        });

        const registerResult = await registerResponse.json();
        console.log('✅ Registration result:', registerResult);

        if (!registerResult.success) {
            console.log('ℹ️  User might already exist, trying login...');
        }

        // Test 3: Login
        console.log('\n3. Testing user login...');
        const loginData = {
            email: 'test@example.com',
            password: 'password123'
        };

        const loginResponse = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        const loginResult = await loginResponse.json();
        console.log('✅ Login result:', loginResult);

        if (!loginResult.success) {
            console.log('❌ Login failed, stopping tests');
            return;
        }

        const token = loginResult.token;

        // Test 4: Get user info
        console.log('\n4. Testing get user info...');
        const userResponse = await fetch(`${API_BASE}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const userResult = await userResponse.json();
        console.log('✅ User info:', userResult);

        // Test 5: Create a diary entry
        console.log('\n5. Testing diary entry creation...');
        const diaryData = {
            content: 'This is a test diary entry',
            mood: 'happy',
            tags: ['test', 'api']
        };

        const diaryResponse = await fetch(`${API_BASE}/diary`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(diaryData)
        });

        const diaryResult = await diaryResponse.json();
        console.log('✅ Diary entry result:', diaryResult);

        // Test 6: Get diary entries
        console.log('\n6. Testing get diary entries...');
        const getDiaryResponse = await fetch(`${API_BASE}/diary`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const getDiaryResult = await getDiaryResponse.json();
        console.log('✅ Get diary entries:', getDiaryResult);

        console.log('\n🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
    // Node.js environment
    const fetch = require('node-fetch');
    testAPI();
}