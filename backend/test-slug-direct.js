const aiService = require('./src/services/ai.service');

async function testDirect() {
  console.log('🧪 Testing AI Service Directly\n');
  
  const testUrls = [
    'https://www.target.com/p/tide-washing-machine-cleaner-6ct/-/A-9106',
    'https://www.walmart.com/ip/Rogaine-for-Men-Hair-Regrowth-Treatment',
    'https://www.nike.com/t/vaporfly-3-mens-road-racing-shoes'
  ];
  
  for (const url of testUrls) {
    console.log(`\n📝 Testing: ${url}`);
    
    try {
      const slug = await aiService.generateHumanReadableUrl(url, []);
      console.log(`✅ Result: ${slug}`);
      console.log(`   Parts: ${slug.split('.').join(' → ')}`);
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
      console.log(`   Stack: ${error.stack}`);
    }
  }
}

testDirect().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
