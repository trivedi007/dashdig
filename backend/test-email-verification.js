require('dotenv').config(); // Load environment variables
const mongoose = require('mongoose');
const User = require('./src/models/User');
const authService = require('./src/services/auth.service');

const testEmailVerification = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create a new user
    const user = new User({
      email: 'testuser@example.com',
      identifier: 'testuser@example.com'
    });
    await user.save();

    // Send verification email
    await authService.sendVerificationEmail(user);
    console.log('Verification email sent.');

    // Simulate the user clicking the verification link
    const token = user.verificationToken; // Get the token from the user document
    const response = await authService.verifyEmail({ params: { token } }, { json: console.log });
    console.log(response);

  } catch (error) {
    console.error('Error during email verification test:', error);
  } finally {
    // Clean up
    await mongoose.connection.close();
  }
};

testEmailVerification();
