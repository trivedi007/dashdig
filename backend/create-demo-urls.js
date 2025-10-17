const mongoose = require('mongoose');

// URL Schema
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

async function createDemoUrls() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashdig');
    console.log('✅ Connected to MongoDB');

    // Create demo URLs
    const demoUrls = [
      {
        shortCode: 'target.centrum.silver',
        originalUrl: 'https://www.target.com/p/centrum-silver-men-50-multivitamin-dietary-supplement-tablets',
        userId: new mongoose.Types.ObjectId(), // Create a dummy user ID
        keywords: ['target', 'centrum', 'silver', 'vitamin', 'mens'],
        clicks: {
          count: 0,
          limit: null // Unlimited clicks
        },
        isActive: true
      },
      {
        shortCode: 'hoka.bondi.running',
        originalUrl: 'https://www.hoka.com/en/us/mens-everyday-running-shoes/bondi-9/197634740874.html',
        userId: new mongoose.Types.ObjectId(), // Create a dummy user ID
        keywords: ['hoka', 'bondi', 'running', 'shoes', 'mens'],
        clicks: {
          count: 0,
          limit: null // Unlimited clicks
        },
        isActive: true
      },
      {
        shortCode: 'grainger.dial.soap',
        originalUrl: 'https://www.grainger.com/product/852HF5',
        userId: new mongoose.Types.ObjectId(), // Create a dummy user ID
        keywords: ['grainger', 'dial', 'soap', 'hand', 'cleaning'],
        clicks: {
          count: 0,
          limit: null // Unlimited clicks
        },
        isActive: true
      },
      {
        shortCode: 'officesupply.charmin.ultra',
        originalUrl: 'https://www.officesupply.com/cleaning-breakroom/cleaning-janitorial-supplies/paper-products-dispensers/bathroom-tissues/charmin-ultra-strong-toilet-paper-mega-rolls-white-sheets-roll-pack-mega-rolls/p1638746.html',
        userId: new mongoose.Types.ObjectId(), // Create a dummy user ID
        keywords: ['officesupply', 'charmin', 'ultra', 'strong', 'toilet', 'paper'],
        clicks: {
          count: 0,
          limit: null // Unlimited clicks
        },
        isActive: true
      },
      {
        shortCode: 'chewy.tidy.cats',
        originalUrl: 'https://www.chewy.com/tidy-cats-free-clean-unscented/dp/168310',
        userId: new mongoose.Types.ObjectId(), // Create a dummy user ID
        keywords: ['chewy', 'tidy', 'cats', 'litter', 'free', 'clean'],
        clicks: {
          count: 0,
          limit: null // Unlimited clicks
        },
        isActive: true
      }
    ];

    for (const urlData of demoUrls) {
      try {
        // Check if URL already exists
        const existing = await Url.findOne({ shortCode: urlData.shortCode });
        if (existing) {
          console.log(`⚠️  URL already exists: ${urlData.shortCode}`);
          continue;
        }

        // Create new URL
        const urlDoc = new Url(urlData);
        await urlDoc.save();
        console.log(`✅ Created: ${urlData.shortCode} → ${urlData.originalUrl}`);
      } catch (error) {
        console.error(`❌ Failed to create ${urlData.shortCode}:`, error.message);
      }
    }

    console.log('🎉 Demo URLs creation completed!');
    
    // List all URLs
    const allUrls = await Url.find({}).select('shortCode originalUrl clicks.count clicks.limit createdAt');
    console.log('\n📊 All URLs in database:');
    allUrls.forEach(url => {
      console.log(`  ${url.shortCode} → ${url.originalUrl} (${url.clicks.count}/${url.clicks.limit || 'unlimited'} clicks)`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createDemoUrls();
