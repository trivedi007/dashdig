const Stripe = require('stripe');
const User = require('../models/User');

// Initialize Stripe only if API key is available
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('⚠️  Stripe API key not configured. Payment features will be disabled.');
}

class PaymentService {
  _checkStripe() {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.');
    }
  }
  async createCustomer(user) {
    this._checkStripe();
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString()
        }
      });

      // Update user with Stripe customer ID
      user.subscription.stripeCustomerId = customer.id;
      await user.save();

      return customer;
    } catch (error) {
      console.error('Create customer error:', error);
      throw error;
    }
  }

  async createSetupIntent(userId) {
    this._checkStripe();
    try {
      const user = await User.findById(userId);
      
      // Create customer if doesn't exist
      if (!user.subscription.stripeCustomerId) {
        await this.createCustomer(user);
      }

      const setupIntent = await stripe.setupIntents.create({
        customer: user.subscription.stripeCustomerId,
        payment_method_types: ['card'],
        usage: 'off_session',
        metadata: {
          userId: userId.toString()
        }
      });

      return {
        clientSecret: setupIntent.client_secret,
        customerId: user.subscription.stripeCustomerId
      };
    } catch (error) {
      console.error('Setup intent error:', error);
      throw error;
    }
  }

  async attachPaymentMethod(userId, paymentMethodId) {
    this._checkStripe();
    try {
      const user = await User.findById(userId);
      
      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.subscription.stripeCustomerId
      });

      // Set as default
      await stripe.customers.update(user.subscription.stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });

      // Update user
      user.subscription.paymentMethodId = paymentMethodId;
      await user.save();

      return { success: true };
    } catch (error) {
      console.error('Attach payment method error:', error);
      throw error;
    }
  }

  async createTrialSubscription(userId, plan = 'pro') {
    try {
    const user = await User.findById(userId);
    
    // For testing, just update the user without creating a real subscription
    user.subscription.plan = plan;
    user.subscription.status = 'trialing';
    user.subscription.trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    await user.save();

    return {
      id: 'test_subscription',
      status: 'trialing',
      trial_end: user.subscription.trialEndsAt
    };
  } catch (error) {
    console.error('Create subscription error:', error);
    throw error;
    }
  }

  async cancelSubscription(userId) {
    this._checkStripe();
    try {
      const user = await User.findById(userId);
      
      if (!user.subscription.stripeSubscriptionId) {
        throw new Error('No active subscription');
      }

      const subscription = await stripe.subscriptions.cancel(
        user.subscription.stripeSubscriptionId
      );

      user.subscription.status = 'canceled';
      await user.save();

      return subscription;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  }

  async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'customer.subscription.trial_will_end':
          // Send reminder email 3 days before trial ends
          await this.handleTrialWillEnd(event.data.object);
          break;
          
        case 'customer.subscription.updated':
          // Update subscription status
          await this.handleSubscriptionUpdated(event.data.object);
          break;
          
        case 'customer.subscription.deleted':
          // Handle cancellation
          await this.handleSubscriptionDeleted(event.data.object);
          break;
          
        case 'payment_method.attached':
          // Payment method successfully added
          console.log('Payment method attached:', event.data.object.id);
          break;
          
        default:
          console.log('Unhandled webhook event:', event.type);
      }
    } catch (error) {
      console.error('Webhook handler error:', error);
      throw error;
    }
  }

  async handleSubscriptionUpdated(subscription) {
    const user = await User.findOne({ 
      'subscription.stripeSubscriptionId': subscription.id 
    });
    
    if (user) {
      user.subscription.status = subscription.status;
      user.subscription.currentPeriodEnd = new Date(subscription.current_period_end * 1000);
      await user.save();
    }
  }

  async handleSubscriptionDeleted(subscription) {
    const user = await User.findOne({ 
      'subscription.stripeSubscriptionId': subscription.id 
    });
    
    if (user) {
      user.subscription.status = 'canceled';
      user.subscription.plan = 'free';
      await user.save();
    }
  }

  async handleTrialWillEnd(subscription) {
    // Send email reminder
    console.log('Trial ending soon for subscription:', subscription.id);
  }
}

module.exports = new PaymentService();
