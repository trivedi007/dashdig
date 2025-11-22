const aiService = require('./src/services/ai.service');

// Test URLs from the bug report
const testCases = [
  {
    url: 'https://www.walmart.com/ip/Rogaine-for-Men-Hair-Regrowth-Treatment',
    expected: ['walmart', 'rogaine', 'men', 'hair', 'regrowth']
  },
  {
    url: 'https://www.nike.com/t/vaporfly-3-mens-road-racing-shoes',
    expected: ['nike', 'vaporfly', 'mens', 'road', 'racing']
  },
  {
    url: 'https://www.amazon.com/Apple-AirPods-Pro-2nd-Generation',
    expected: ['amazon', 'apple', 'airpods', 'pro']
  },
  {
    url: 'https://www.hoka.com/en/us/mens-road/bondi-8/1123202.html',
    expected: ['hoka', 'bondi', 'road']
  }
];

console.log('🧪 Testing Improved Slug Generation\n');
console.log('='.repeat(70));

async function runTests() {
  for (const test of testCases) {
    console.log(`\n📝 URL: ${test.url}`);
    console.log(`Expected words: ${test.expected.join(', ')}`);
    
    try {
      const slug = await aiService.generateHumanReadableUrl(test.url, []);
      const parts = slug.split('.');
      
      console.log(`✅ Generated: ${slug}`);
      console.log(`   Parts (${parts.length}): ${parts.join(' → ')}`);
      
      // Check how many expected words are in the slug
      const matches = test.expected.filter(word => 
        slug.toLowerCase().includes(word.toLowerCase())
      );
      
      console.log(`   Matched ${matches.length}/${test.expected.length} expected words: ${matches.join(', ')}`);
      
      if (matches.length >= Math.ceil(test.expected.length * 0.6)) {
        console.log(`   ✅ PASS: Good contextual slug`);
      } else {
        console.log(`   ⚠️  WARN: Could be more contextual`);
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n💡 Summary:');
  console.log('   All slugs should be multi-word and contextual');
  console.log('   No single-word slugs (like "walmart" alone)');
  console.log('   No strange artifacts (like "ansi")');
}

runTests().catch(console.error);
