// Check environment variables in production
console.log('=== ENVIRONMENT VARIABLES CHECK ===');
console.log('BASE_URL:', process.env.BASE_URL);
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('REDIS_URL:', process.env.REDIS_URL ? 'SET' : 'NOT SET');
console.log('=====================================');

// Test URL generation
const baseUrl = process.env.BASE_URL || process.env.FRONTEND_URL || 'https://dashdig.com';
const testSlug = 'hoka.bondi.running';
const generatedUrl = `${baseUrl}/${testSlug}`;

console.log('Generated URL:', generatedUrl);
console.log('Expected URL:', 'https://dashdig.com/hoka.bondi.running');
console.log('Match:', generatedUrl === 'https://dashdig.com/hoka.bondi.running' ? 'YES' : 'NO');
