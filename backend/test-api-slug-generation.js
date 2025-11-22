/**
 * Test actual API slug generation
 * This tests the real API endpoints to see what slugs are generated
 */

const axios = require('axios');

// Test URLs
const testUrls = [
  {
    url: 'https://www.walmart.com/ip/Rogaine-for-Men-Hair-Regrowth-Treatment',
    expected: ['walmart', 'rogaine', 'men', 'hair']
  },
  {
    url: 'https://www.nike.com/t/vaporfly-3-mens-road-racing-shoes',
    expected: ['nike', 'vaporfly', 'running', 'shoes']
  },
  {
    url: 'https://www.amazon.com/Apple-AirPods-Pro-2nd-Generation',
    expected: ['amazon', 'airpods', 'apple']
  },
  {
    url: 'https://www.hoka.com/en/us/mens-road/bondi-8/1123202.html',
    expected: ['hoka', 'bondi', 'running']
  }
];

const API_URL = process.env.API_URL || 'http://localhost:5001';

async function testSlugGeneration() {
  console.log('🧪 Testing API Slug Generation\n');
  console.log(`API URL: ${API_URL}\n`);
  console.log('='.repeat(60));
  
  for (const test of testUrls) {
    console.log(`\n📝 Testing: ${test.url}`);
    console.log(`Expected words: ${test.expected.join(', ')}`);
    
    try {
      // Test the demo endpoint (no auth required)
      const response = await axios.post(`${API_URL}/demo-url`, {
        url: test.url,
        keywords: []
      });
      
      if (response.data && response.data.data) {
        const slug = response.data.data.slug;
        const shortUrl = response.data.data.shortUrl;
        
        console.log(`✅ Generated slug: "${slug}"`);
        console.log(`   Short URL: ${shortUrl}`);
        
        // Check if slug contains expected words
        const slugLower = slug.toLowerCase();
        const matchedWords = test.expected.filter(word => 
          slugLower.includes(word.toLowerCase())
        );
        
        console.log(`   Matched ${matchedWords.length}/${test.expected.length} expected words:`, matchedWords.join(', '));
        
        // Analyze slug structure
        const parts = slug.split('.');
        console.log(`   Slug parts (${parts.length}):`, parts.join(' → '));
        
        if (parts.length === 1) {
          console.log(`   ⚠️  WARNING: Single-word slug detected!`);
        } else if (parts.length >= 3) {
          console.log(`   ✅ Good: Multi-word contextual slug`);
        } else {
          console.log(`   ⚠️  Short slug (${parts.length} parts)`);
        }
        
      } else {
        console.log(`❌ Unexpected response format`);
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`❌ API Error: ${error.response.status} - ${error.response.statusText}`);
        console.log(`   ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.log(`❌ Network Error: No response from ${API_URL}`);
        console.log(`   Is the server running?`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 If slugs are single words:');
  console.log('   1. Check ai.service.js generateFallbackUrl()');
  console.log('   2. Verify contextual extraction logic');
  console.log('   3. Check if meaningfulWords array is being populated');
  console.log('   4. Review brand-specific extraction patterns\n');
}

// Run the test
testSlugGeneration().catch(console.error);
