const mongoose = require('mongoose');
const Url = require('./src/models/Url');

async function debugUrl() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dashdig:2acSHrtrjM5it3V2@dashdig-cluster.n8pizvn.mongodb.net/?retryWrites=true&w=majority&appName=dashdig-cluster');
    console.log('✅ Connected to MongoDB');

    const urlDoc = await Url.findOne({ shortCode: 'nike.vaporfly.shoes.mens' });
    
    if (!urlDoc) {
      console.log('❌ URL not found');
      return;
    }

    console.log('📋 URL Details:');
    console.log('  ID:', urlDoc._id);
    console.log('  Short Code:', urlDoc.shortCode);
    console.log('  Original URL:', urlDoc.originalUrl);
    console.log('  Clicks Count:', urlDoc.clicks.count);
    console.log('  Clicks Limit:', urlDoc.clicks.limit);
    console.log('  Expires At:', urlDoc.expiresAt);
    console.log('  Is Active:', urlDoc.isActive);
    console.log('  Created At:', urlDoc.createdAt);
    
    console.log('\n🔍 Expiry Check:');
    console.log('  hasExpired():', urlDoc.hasExpired());
    console.log('  Click limit check:', urlDoc.clicks.limit && urlDoc.clicks.limit > 0 && urlDoc.clicks.count >= urlDoc.clicks.limit);
    console.log('  Expiration date check:', urlDoc.expiresAt && new Date() > urlDoc.expiresAt);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

debugUrl();
