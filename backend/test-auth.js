const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
  try {
    console.log('🧪 Testing Authentication Flow...\n');
    
    // Test 1: Request magic link
    console.log('1. Requesting magic link...');
    const response = await axios.post(`${API_URL}/auth/magic-link`, {
      identifier: 'test@example.com' // Use your real email
    });
    
    console.log('✅ Magic link sent:', response.data);
    console.log('\n📧 Check your email and copy the token from the URL');
    console.log('The URL will look like: http://localhost:3000/auth/verify?token=xxx');
    console.log('\nOr use the 6-digit code from the email\n');
    
    // Wait for user input
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    readline.question('Enter the token: ', async (token) => {
      readline.question('Enter the 6-digit code (or press Enter to skip): ', async (code) => {
        
        // Test 2: Verify token
        console.log('\n2. Verifying token...');
        const verifyResponse = await axios.post(`${API_URL}/auth/verify`, {
          token,
          code: code || undefined
        });
        
        console.log('✅ Verification successful!');
        console.log('User:', verifyResponse.data.user);
        console.log('JWT Token:', verifyResponse.data.token.substring(0, 20) + '...');
        
        // Test 3: Get current user
        console.log('\n3. Testing authenticated request...');
        const meResponse = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${verifyResponse.data.token}`
          }
        });
        
        console.log('✅ Authenticated user:', meResponse.data.user);
        
        console.log('\n✅ All auth tests passed!');
        readline.close();
      });
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testAuth();
