const mongoose = require('mongoose');
const Url = require('./src/models/Url');

async function fixUrlExpiry() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://dashdig:2acSHrtrjM5it3V2@dashdig-cluster.n8pizvn.mongodb.net/?retryWrites=true&w=majority&appName=dashdig-cluster');
    console.log('✅ Connected to MongoDB');

    // Find and update the hoka.bondi.running URL
    const urlDoc = await Url.findOne({ shortCode: 'hoka.bondi.running' });
    
    if (!urlDoc) {
      console.log('❌ URL not found');
      return;
    }

    console.log('📋 Current URL Details:');
    console.log('  Clicks Count:', urlDoc.clicks.count);
    console.log('  Clicks Limit:', urlDoc.clicks.limit);
    console.log('  Expires At:', urlDoc.expiresAt);
    console.log('  Is Active:', urlDoc.isActive);

    // Ensure the URL is not expired
    urlDoc.clicks.limit = null; // Unlimited clicks
    urlDoc.expiresAt = null; // No expiration date
    urlDoc.isActive = true; // Ensure it's active

    await urlDoc.save();
    console.log('✅ URL updated successfully');

    // Verify the update
    const updatedUrl = await Url.findOne({ shortCode: 'hoka.bondi.running' });
    console.log('\n📋 Updated URL Details:');
    console.log('  Clicks Count:', updatedUrl.clicks.count);
    console.log('  Clicks Limit:', updatedUrl.clicks.limit);
    console.log('  Expires At:', updatedUrl.expiresAt);
    console.log('  Is Active:', updatedUrl.isActive);
    console.log('  hasExpired():', updatedUrl.hasExpired());
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixUrlExpiry();
