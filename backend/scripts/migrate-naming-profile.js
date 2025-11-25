/**
 * Migration script to add namingProfile to existing users
 * Run once: node scripts/migrate-naming-profile.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

async function migrate() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Migrating users...');
    
    const result = await User.updateMany(
      { namingProfile: { $exists: false } },
      { 
        $set: { 
          namingProfile: {
            detectedPattern: {
              confidence: 0,
              separator: '.',
              capitalization: 'TitleCase',
              includesBrand: true,
              includesYear: false,
              usesCTA: false,
              avgWordCount: 0
            },
            preferences: {
              preferredStyle: 'auto',
              preferredLength: 'medium',
              avoidWords: [],
              mustInclude: [],
              brandVoice: 'professional'
            },
            examples: [],
            industry: 'other',
            urlsAnalyzed: 0
          },
          profileComplete: false
        }
      }
    );

    console.log(`✅ Migration complete! Updated ${result.modifiedCount} users`);
    
    // Also update users with partial namingProfile
    const partialResult = await User.updateMany(
      { 
        namingProfile: { $exists: true },
        'namingProfile.detectedPattern': { $exists: false }
      },
      {
        $set: {
          'namingProfile.detectedPattern': {
            confidence: 0,
            separator: '.',
            capitalization: 'TitleCase',
            includesBrand: true,
            includesYear: false,
            usesCTA: false,
            avgWordCount: 0
          }
        }
      }
    );

    console.log(`✅ Fixed ${partialResult.modifiedCount} users with partial namingProfile`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

migrate();

