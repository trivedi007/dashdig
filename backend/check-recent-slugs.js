const mongoose = require('mongoose');
const Url = require('./src/models/Url');
require('dotenv').config();

async function checkRecentSlugs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔍 Checking recent URL slugs in database...\n');
    
    const recentUrls = await Url.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .select('shortCode originalUrl createdAt')
      .lean();
    
    console.log('📊 Last 10 URLs created:\n');
    
    recentUrls.forEach((url, i) => {
      const parts = url.shortCode.split('.');
      const partsCount = parts.length;
      const status = partsCount >= 3 ? '✅' : (partsCount === 1 ? '❌' : '⚠️');
      
      console.log(`${i + 1}. ${status} ${url.shortCode} (${partsCount} parts)`);
      console.log(`   URL: ${url.originalUrl.substring(0, 60)}...`);
      console.log(`   Created: ${url.createdAt}`);
      console.log('');
    });
    
    const singleWordUrls = recentUrls.filter(u => !u.shortCode.includes('.'));
    const multiWordUrls = recentUrls.filter(u => u.shortCode.split('.').length >= 3);
    
    console.log('📈 Summary:');
    console.log(`   Single-word slugs: ${singleWordUrls.length}/${recentUrls.length}`);
    console.log(`   Multi-word contextual: ${multiWordUrls.length}/${recentUrls.length}`);
    
    if (singleWordUrls.length > 0) {
      console.log('\n❌ ISSUE CONFIRMED: Single-word slugs detected');
      console.log('\nSingle-word slugs found:');
      singleWordUrls.forEach(u => {
        console.log(`   - ${u.shortCode} → ${u.originalUrl.substring(0, 50)}...`);
      });
    } else {
      console.log('\n✅ No issues: All slugs are contextual');
    }
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkRecentSlugs();
