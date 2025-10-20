#!/usr/bin/env node

/**
 * Test Script for Smart Links Advanced Features
 * 
 * Run this after restarting the backend server to verify:
 * 1. Pattern detection for Amazon, YouTube, GitHub, etc.
 * 2. Slug availability checking
 * 3. Smart suggestions when slug is taken
 */

const { detectPattern, getSupportedPatterns } = require('./src/services/urlPatternDetector');

console.log('🧪 TESTING SMART LINKS ADVANCED FEATURES\n');
console.log('='.repeat(60));

// Test 1: Get Supported Patterns
console.log('\n📋 TEST 1: Supported Patterns\n');
const patterns = getSupportedPatterns();
console.log(`✅ Found ${patterns.length} patterns:\n`);
patterns.forEach(p => {
  console.log(`   🎯 ${p.name.padEnd(15)} - ${p.template}`);
  console.log(`      Domains: ${p.domains.join(', ')}`);
});

// Test 2: Amazon URL Pattern Detection
console.log('\n\n🛒 TEST 2: Amazon Pattern Detection\n');
const amazonUrl = 'https://www.amazon.com/Echo-Dot-5th-Gen-2022-release/dp/B09B8V1LZ3';
console.log(`URL: ${amazonUrl}`);
const amazonResult = detectPattern(amazonUrl);
console.log('\nResult:');
console.log(JSON.stringify(amazonResult, null, 2));

// Test 3: YouTube URL Pattern Detection
console.log('\n\n🎥 TEST 3: YouTube Pattern Detection\n');
const youtubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
console.log(`URL: ${youtubeUrl}`);
const youtubeResult = detectPattern(youtubeUrl);
console.log('\nResult:');
console.log(JSON.stringify(youtubeResult, null, 2));

// Test 4: GitHub URL Pattern Detection
console.log('\n\n💻 TEST 4: GitHub Pattern Detection\n');
const githubUrl = 'https://github.com/facebook/react';
console.log(`URL: ${githubUrl}`);
const githubResult = detectPattern(githubUrl);
console.log('\nResult:');
console.log(JSON.stringify(githubResult, null, 2));

// Test 5: NYTimes URL Pattern Detection
console.log('\n\n📰 TEST 5: NYTimes Pattern Detection\n');
const nytimesUrl = 'https://www.nytimes.com/2025/01/15/technology/ai-regulation-congress.html';
console.log(`URL: ${nytimesUrl}`);
const nytimesResult = detectPattern(nytimesUrl);
console.log('\nResult:');
console.log(JSON.stringify(nytimesResult, null, 2));

// Test 6: Twitter/X URL Pattern Detection
console.log('\n\n🐦 TEST 6: Twitter/X Pattern Detection\n');
const twitterUrl = 'https://twitter.com/elonmusk/status/1234567890';
console.log(`URL: ${twitterUrl}`);
const twitterResult = detectPattern(twitterUrl);
console.log('\nResult:');
console.log(JSON.stringify(twitterResult, null, 2));

// Test 7: Generic URL (No Pattern Match)
console.log('\n\n🌐 TEST 7: Generic URL (No Pattern)\n');
const genericUrl = 'https://example.com/some/random/path';
console.log(`URL: ${genericUrl}`);
const genericResult = detectPattern(genericUrl);
console.log('\nResult:');
console.log(JSON.stringify(genericResult, null, 2));

console.log('\n' + '='.repeat(60));
console.log('\n✅ ALL TESTS COMPLETED!\n');
console.log('📝 Summary:');
console.log(`   - Patterns loaded: ${patterns.length}`);
console.log(`   - Amazon detection: ${amazonResult.matched ? '✅' : '❌'}`);
console.log(`   - YouTube detection: ${youtubeResult.matched ? '✅' : '❌'}`);
console.log(`   - GitHub detection: ${githubResult.matched ? '✅' : '❌'}`);
console.log(`   - NYTimes detection: ${nytimesResult.matched ? '✅' : '❌'}`);
console.log(`   - Twitter detection: ${twitterResult.matched ? '✅' : '❌'}`);
console.log(`   - Generic fallback: ${!genericResult.matched ? '✅' : '❌'}`);

console.log('\n🚀 To test slug availability and suggestions:');
console.log('   1. Restart the backend server: cd backend && PORT=5002 node src/server.js');
console.log('   2. Open http://localhost:3000/smart-link-creator-demo');
console.log('   3. Paste an Amazon/YouTube/GitHub URL and watch the magic! ✨\n');

