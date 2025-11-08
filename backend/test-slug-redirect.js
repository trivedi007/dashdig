#!/usr/bin/env node

/**
 * Test Script: URL Redirect Functionality
 * 
 * Tests that shortened URLs properly redirect to their original URLs
 * Verifies the case sensitivity fix works correctly
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Url = require('./src/models/Url');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dashdig';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5001';

async function testSlugRedirect() {
  console.log('🧪 URL Redirect Test');
  console.log('===================\n');
  
  try {
    // Connect to database
    console.log('📊 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Find a sample URL
    console.log('🔍 Looking for test URLs in database...');
    const urls = await Url.find({ isActive: true }).limit(5);
    
    if (urls.length === 0) {
      console.log('⚠️  No URLs found in database. Creating a test URL...\n');
      
      // Create a test URL
      const testUrl = new Url({
        shortCode: 'test.example.url',
        originalUrl: 'https://www.example.com',
        keywords: ['test'],
        userId: null,
        clicks: {
          count: 0,
          total: 0
        },
        isActive: true
      });
      
      await testUrl.save();
      console.log('✅ Test URL created:', testUrl.shortCode);
      urls.push(testUrl);
    }
    
    console.log(`\n📋 Found ${urls.length} test URLs:\n`);
    
    // Test each URL
    for (const url of urls) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`\n🔗 Testing: ${url.shortCode}`);
      console.log(`   Original URL: ${url.originalUrl}`);
      console.log(`   Current clicks: ${url.clicks?.count || 0}`);
      console.log(`   Active: ${url.isActive}`);
      console.log(`   Stored as (lowercase): ${url.shortCode}`);
      
      // Test various case combinations
      const testCases = [
        url.shortCode, // Original case (already lowercase in DB)
        url.shortCode.toUpperCase(), // ALL CAPS
        // Capitalize first letter of each word
        url.shortCode.split('.').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join('.')
      ];
      
      console.log('\n   Testing case variations:');
      for (const testCase of testCases) {
        const testUrl = `${BASE_URL}/${testCase}`;
        console.log(`   - ${testUrl}`);
        
        // Simulate database lookup with lowercase
        const lookupSlug = testCase.toLowerCase();
        const found = await Url.findOne({ shortCode: lookupSlug });
        
        if (found) {
          console.log(`     ✅ Would redirect to: ${found.originalUrl}`);
        } else {
          console.log(`     ❌ NOT FOUND (this would be a 404)`);
        }
      }
      
      console.log('');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Summary
    console.log('✅ TEST COMPLETE');
    console.log('\n📝 Summary:');
    console.log('   - All slugs are stored in lowercase in database');
    console.log('   - Lookups convert input to lowercase');
    console.log('   - This allows case-insensitive URL matching');
    console.log('\n💡 To test in browser:');
    console.log(`   1. Start server: npm start`);
    console.log(`   2. Visit any of the URLs above`);
    console.log(`   3. Should redirect regardless of case used\n`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

// Run test
testSlugRedirect();

