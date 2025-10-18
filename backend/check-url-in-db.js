require('dotenv').config();
const mongoose = require('mongoose');

// Define the URL schema (must match the model)
const urlSchema = new mongoose.Schema({
  shortCode: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  domain: {
    type: String,
    index: true,
    default: null
  },
  title: String,
  description: String,
  keywords: [String],
  qrCode: String,
  clicks: {
    count: { type: Number, default: 0 },
    limit: { type: Number, default: 10 },
    lastClickedAt: Date
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Url = mongoose.model('Url', urlSchema);

async function checkDatabase() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 DATABASE DIRECT CHECK');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    const dbUri = process.env.MONGODB_URI;
    if (!dbUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    // Extract host for display
    let dbHost = 'unknown';
    if (dbUri.includes('@')) {
      dbHost = dbUri.split('@')[1]?.split('/')[0] || 'unknown';
    }
    console.log('🎯 Target Database:', dbHost);
    
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB\n');

    // Query 1: Look for the specific slug
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 QUERY 1: Exact Match');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const targetSlug = 'chewy.tidy.cats.free';
    console.log('Query:', `db.urls.findOne({ shortCode: "${targetSlug}" })`);
    console.log('');
    
    const exactMatch = await Url.findOne({ shortCode: targetSlug });
    
    if (exactMatch) {
      console.log('✅ FOUND EXACT MATCH:');
      console.log(JSON.stringify(exactMatch, null, 2));
    } else {
      console.log('❌ NOT FOUND: No URL with shortCode "chewy.tidy.cats.free"');
    }
    console.log('\n');

    // Query 2: Case-insensitive search
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 QUERY 2: Case-Insensitive Search');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Query:', `db.urls.find({ shortCode: /chewy.tidy.cats.free/i })`);
    console.log('');
    
    const caseInsensitive = await Url.find({ 
      shortCode: new RegExp('chewy.tidy.cats.free', 'i') 
    });
    
    if (caseInsensitive.length > 0) {
      console.log(`✅ FOUND ${caseInsensitive.length} CASE-INSENSITIVE MATCH(ES):`);
      caseInsensitive.forEach((url, index) => {
        console.log(`\n${index + 1}. shortCode: ${url.shortCode}`);
        console.log(`   originalUrl: ${url.originalUrl}`);
        console.log(`   userId: ${url.userId}`);
        console.log(`   isActive: ${url.isActive}`);
        console.log(`   createdAt: ${url.createdAt}`);
      });
    } else {
      console.log('❌ NOT FOUND: No similar URLs (case-insensitive)');
    }
    console.log('\n');

    // Query 3: Partial match (contains "chewy")
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 QUERY 3: Partial Match (contains "chewy")');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Query:', `db.urls.find({ shortCode: /chewy/i })`);
    console.log('');
    
    const partialMatch = await Url.find({ 
      shortCode: new RegExp('chewy', 'i') 
    }).limit(10);
    
    if (partialMatch.length > 0) {
      console.log(`✅ FOUND ${partialMatch.length} URL(S) CONTAINING "chewy":`);
      partialMatch.forEach((url, index) => {
        console.log(`\n${index + 1}. shortCode: ${url.shortCode}`);
        console.log(`   originalUrl: ${url.originalUrl}`);
        console.log(`   userId: ${url.userId}`);
        console.log(`   isActive: ${url.isActive}`);
      });
    } else {
      console.log('❌ NOT FOUND: No URLs containing "chewy"');
    }
    console.log('\n');

    // Query 4: URLs with null userId
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 QUERY 4: URLs with null userId');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Query:', `db.urls.find({ userId: null })`);
    console.log('');
    
    const nullUserUrls = await Url.find({ userId: null }).limit(10);
    console.log(`Found ${nullUserUrls.length} URLs with null userId`);
    
    if (nullUserUrls.length > 0) {
      nullUserUrls.forEach((url, index) => {
        console.log(`\n${index + 1}. shortCode: ${url.shortCode}`);
        console.log(`   originalUrl: ${url.originalUrl}`);
        console.log(`   userId: ${url.userId}`);
        console.log(`   isActive: ${url.isActive}`);
      });
    }
    console.log('\n');

    // Query 5: Database statistics
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 DATABASE STATISTICS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const totalUrls = await Url.countDocuments({});
    const activeUrls = await Url.countDocuments({ isActive: true });
    const inactiveUrls = await Url.countDocuments({ isActive: false });
    const nullUserCount = await Url.countDocuments({ userId: null });
    
    console.log('Total URLs in database:', totalUrls);
    console.log('Active URLs:', activeUrls);
    console.log('Inactive URLs:', inactiveUrls);
    console.log('URLs with null userId:', nullUserCount);
    console.log('');

    // Query 6: Sample of recent URLs
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 QUERY 6: Recent URLs (Last 10)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Query:', `db.urls.find().sort({ createdAt: -1 }).limit(10)`);
    console.log('');
    
    const recentUrls = await Url.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('shortCode originalUrl userId isActive createdAt');
    
    if (recentUrls.length > 0) {
      console.log(`Recent URLs:`);
      recentUrls.forEach((url, index) => {
        console.log(`\n${index + 1}. shortCode: ${url.shortCode}`);
        console.log(`   originalUrl: ${url.originalUrl.substring(0, 50)}...`);
        console.log(`   userId: ${url.userId}`);
        console.log(`   isActive: ${url.isActive}`);
        console.log(`   createdAt: ${url.createdAt}`);
      });
    } else {
      console.log('No URLs found in database');
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DATABASE CHECK COMPLETE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the check
checkDatabase();
