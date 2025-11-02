/**
 * Test Script for SMS Verification
 * Tests SMS-based 2FA functionality
 * 
 * Usage:
 *   node src/test/test-sms-verification.js <phone-number>
 *   Example: node src/test/test-sms-verification.js +1234567890
 */

require('dotenv').config();
const mongoose = require('mongoose');
const smsService = require('../services/sms.service');
const SmsVerification = require('../models/SmsVerification');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSmsVerification() {
  try {
    // Get phone number from command line
    const phoneNumber = process.argv[2];
    
    if (!phoneNumber) {
      log('❌ Error: Please provide a phone number', 'red');
      log('Usage: node src/test/test-sms-verification.js <phone-number>', 'yellow');
      log('Example: node src/test/test-sms-verification.js +1234567890', 'yellow');
      process.exit(1);
    }

    log('\n🚀 Starting SMS Verification Tests', 'cyan');
    log('=====================================\n', 'cyan');

    // Connect to MongoDB
    log('📦 Connecting to MongoDB...', 'blue');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dashdig';
    await mongoose.connect(mongoUri);
    log('✅ Connected to MongoDB\n', 'green');

    // Check Twilio configuration
    log('🔧 Checking Twilio Configuration...', 'blue');
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      log('❌ Twilio not configured. Set the following in .env:', 'red');
      log('   - TWILIO_ACCOUNT_SID', 'yellow');
      log('   - TWILIO_AUTH_TOKEN', 'yellow');
      log('   - TWILIO_PHONE_NUMBER\n', 'yellow');
      process.exit(1);
    }
    log('✅ Twilio configured\n', 'green');

    // Test 1: Send verification code
    log('📝 Test 1: Sending verification code...', 'blue');
    const sendResult = await smsService.sendVerificationSms({
      phone: phoneNumber,
      ipAddress: '127.0.0.1'
    });
    log(`✅ Code sent successfully to ${sendResult.phone}`, 'green');
    log(`   Message SID: ${sendResult.messageSid}`, 'cyan');
    log(`   Expires in: ${sendResult.expiresIn} seconds\n`, 'cyan');

    // Wait for user input
    log('📱 Check your phone for the verification code', 'yellow');
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const code = await new Promise((resolve) => {
      readline.question('Enter the 6-digit code: ', (answer) => {
        readline.close();
        resolve(answer);
      });
    });

    // Test 2: Verify code
    log('\n📝 Test 2: Verifying code...', 'blue');
    try {
      const verifyResult = await smsService.verifySmsCode({
        phone: phoneNumber,
        code: code.trim()
      });
      log(`✅ Code verified successfully!`, 'green');
      log(`   Phone: ${verifyResult.phone}`, 'cyan');
      log(`   Verified: ${verifyResult.verified}\n`, 'cyan');
    } catch (error) {
      log(`❌ Verification failed: ${error.message}\n`, 'red');
    }

    // Test 3: Test rate limiting
    log('📝 Test 3: Testing rate limiting...', 'blue');
    try {
      await smsService.sendVerificationSms({
        phone: phoneNumber,
        ipAddress: '127.0.0.1'
      });
      log('❌ Rate limiting did not work (should have blocked this request)', 'red');
    } catch (error) {
      if (error.message.includes('wait')) {
        log(`✅ Rate limiting working: ${error.message}\n`, 'green');
      } else {
        log(`❌ Unexpected error: ${error.message}\n`, 'red');
      }
    }

    // Test 4: Test invalid code
    log('📝 Test 4: Testing invalid code...', 'blue');
    
    // First, send a new code to have an active verification
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute for rate limit
    await smsService.sendVerificationSms({
      phone: phoneNumber + '1', // Different phone to avoid conflicts
      ipAddress: '127.0.0.1'
    });
    
    try {
      await smsService.verifySmsCode({
        phone: phoneNumber + '1',
        code: '000000' // Invalid code
      });
      log('❌ Invalid code was accepted (should have been rejected)', 'red');
    } catch (error) {
      if (error.message.includes('Invalid verification code')) {
        log(`✅ Invalid code rejected: ${error.message}\n`, 'green');
      } else {
        log(`❌ Unexpected error: ${error.message}\n`, 'red');
      }
    }

    // Test 5: Get statistics
    log('📝 Test 5: Getting statistics...', 'blue');
    const stats = await smsService.getStatistics();
    log('✅ Statistics:', 'green');
    log(`   Total: ${stats.total}`, 'cyan');
    log(`   Active: ${stats.active}`, 'cyan');
    log(`   Verified: ${stats.verified}`, 'cyan');
    log(`   Expired: ${stats.expired}`, 'cyan');
    log(`   Max attempts: ${stats.maxAttempts}`, 'cyan');
    log(`   Service configured: ${stats.serviceConfigured}\n`, 'cyan');

    // Test 6: Cleanup
    log('📝 Test 6: Testing cleanup...', 'blue');
    const cleanupResult = await smsService.cleanupExpired();
    log(`✅ Cleanup completed:`, 'green');
    log(`   Expired deleted: ${cleanupResult.expiredDeleted}`, 'cyan');
    log(`   Old verified deleted: ${cleanupResult.oldVerifiedDeleted}`, 'cyan');
    log(`   Total: ${cleanupResult.total}\n`, 'cyan');

    log('=====================================', 'cyan');
    log('✅ All tests completed!', 'green');
    log('=====================================\n', 'cyan');

  } catch (error) {
    log(`\n❌ Test failed: ${error.message}`, 'red');
    console.error(error);
  } finally {
    await mongoose.disconnect();
    log('📦 Disconnected from MongoDB', 'blue');
    process.exit(0);
  }
}

// Run tests
testSmsVerification();

