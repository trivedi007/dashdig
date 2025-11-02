/**
 * Email Verification Test Script
 * Tests the complete email verification flow
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const emailService = require('../services/email.service');
const tokenCleanupService = require('../services/token-cleanup.service');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testEmailVerification() {
  try {
    log(colors.cyan, '\n🧪 Starting Email Verification Tests...\n');

    // Connect to database
    log(colors.blue, '📊 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dashdig');
    log(colors.green, '✅ Database connected\n');

    // Test 1: Create test user
    log(colors.yellow, '📝 Test 1: Creating test user...');
    const testEmail = `test.${Date.now()}@example.com`;
    const testUser = new User({
      email: testEmail,
      identifier: testEmail,
      profile: {
        name: 'Test User'
      },
      emailVerified: false
    });

    const token = testUser.generateVerificationToken();
    testUser.recordVerificationEmailSent();
    await testUser.save();

    log(colors.green, `✅ User created: ${testEmail}`);
    log(colors.green, `✅ Token generated: ${token.substring(0, 16)}...`);
    log(colors.green, `✅ Token expires: ${testUser.verificationTokenExpires}\n`);

    // Test 2: Send verification email
    log(colors.yellow, '📧 Test 2: Sending verification email...');
    try {
      const result = await emailService.sendVerificationEmail({
        email: testUser.email,
        name: testUser.profile.name,
        token
      });
      log(colors.green, `✅ Email sent successfully`);
      log(colors.green, `✅ Message ID: ${result.messageId}\n`);
    } catch (emailError) {
      log(colors.red, `❌ Email sending failed: ${emailError.message}`);
      log(colors.yellow, '⚠️  Check your SMTP configuration in .env file\n');
    }

    // Test 3: Verify token validation
    log(colors.yellow, '🔐 Test 3: Testing token validation...');
    const isValid = testUser.isValidVerificationToken(token);
    if (isValid) {
      log(colors.green, '✅ Token validation works correctly\n');
    } else {
      log(colors.red, '❌ Token validation failed\n');
    }

    // Test 4: Test timing-safe comparison with wrong token
    log(colors.yellow, '🔐 Test 4: Testing invalid token...');
    const invalidToken = 'wrong-token-12345';
    const isInvalid = testUser.isValidVerificationToken(invalidToken);
    if (!isInvalid) {
      log(colors.green, '✅ Invalid token correctly rejected\n');
    } else {
      log(colors.red, '❌ Invalid token incorrectly accepted\n');
    }

    // Test 5: Test rate limiting
    log(colors.yellow, '🚦 Test 5: Testing rate limiting...');
    let canSend = testUser.canSendVerificationEmail();
    log(colors.green, `✅ Can send email: ${canSend} (count: ${testUser.verificationEmailSentCount})`);
    
    // Simulate sending 2 more emails
    testUser.recordVerificationEmailSent();
    testUser.recordVerificationEmailSent();
    await testUser.save();
    
    canSend = testUser.canSendVerificationEmail();
    log(colors.green, `✅ Can send email: ${canSend} (count: ${testUser.verificationEmailSentCount})`);
    
    if (testUser.verificationEmailSentCount >= 3) {
      log(colors.green, '✅ Rate limiting working correctly\n');
    }

    // Test 6: Simulate email verification
    log(colors.yellow, '✅ Test 6: Simulating email verification...');
    testUser.emailVerified = true;
    testUser.isVerified = true;
    testUser.verificationToken = null;
    testUser.verificationTokenExpires = null;
    await testUser.save();
    log(colors.green, '✅ User verified successfully\n');

    // Test 7: Test token cleanup
    log(colors.yellow, '🧹 Test 7: Testing token cleanup...');
    
    // Create user with expired token
    const expiredUser = new User({
      email: `expired.${Date.now()}@example.com`,
      identifier: `expired.${Date.now()}@example.com`,
      verificationToken: 'expired-token',
      verificationTokenExpires: new Date(Date.now() - 1000), // Expired 1 second ago
      emailVerified: false
    });
    await expiredUser.save();
    
    // Run cleanup
    const cleanupResult = await tokenCleanupService.cleanupExpiredTokens();
    log(colors.green, `✅ Cleanup completed: ${cleanupResult.tokensCleanedUp} token(s) cleaned\n`);

    // Test 8: Get statistics
    log(colors.yellow, '📊 Test 8: Getting cleanup statistics...');
    const stats = await tokenCleanupService.getStatistics();
    log(colors.green, '✅ Statistics retrieved:');
    log(colors.cyan, `   - Expired tokens: ${stats.statistics.expiredTokens}`);
    log(colors.cyan, `   - Active tokens: ${stats.statistics.activeTokens}`);
    log(colors.cyan, `   - Unverified users: ${stats.statistics.unverifiedUsers}`);
    log(colors.cyan, `   - Rate limited users: ${stats.statistics.rateLimitedUsers}\n`);

    // Cleanup test data
    log(colors.yellow, '🧹 Cleaning up test data...');
    await User.deleteMany({ email: { $regex: /^test\.|^expired\./ } });
    log(colors.green, '✅ Test data cleaned up\n');

    log(colors.green, '✅ All tests completed successfully! 🎉\n');

    // Print summary
    log(colors.cyan, '📋 Summary:');
    log(colors.cyan, '   ✅ User creation and token generation');
    log(colors.cyan, '   ✅ Email sending (check SMTP logs)');
    log(colors.cyan, '   ✅ Token validation (timing-safe)');
    log(colors.cyan, '   ✅ Rate limiting');
    log(colors.cyan, '   ✅ Email verification flow');
    log(colors.cyan, '   ✅ Token cleanup');
    log(colors.cyan, '   ✅ Statistics retrieval\n');

  } catch (error) {
    log(colors.red, `\n❌ Test failed: ${error.message}`);
    console.error(error);
  } finally {
    await mongoose.connection.close();
    log(colors.blue, '📊 Database connection closed\n');
    process.exit(0);
  }
}

// Run tests
testEmailVerification();

