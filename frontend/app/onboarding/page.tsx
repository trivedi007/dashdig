'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

// Load Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) return;
    
    setLoading(true);
    setError('');

    try {
      // Get client secret from backend
      const token = localStorage.getItem('token');
      const setupResponse = await fetch('http://localhost:5001/api/payment/setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const { clientSecret } = await setupResponse.json();

      // Confirm card setup
      const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Attach payment method to user
      const attachResponse = await fetch('http://localhost:5001/api/payment/attach-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentMethodId: setupIntent?.payment_method
        })
      });

      const result = await attachResponse.json();

      if (result.success) {
        // Success! Redirect to dashboard
        router.push('/dashboard?welcome=true&trial=started');
      }

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-3 border-2 border-gray-200 rounded-lg">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          We'll charge $29/month after your 7-day free trial ends
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
                 text-white font-semibold rounded-lg hover:from-blue-700 
                 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Start 7-Day Free Trial'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Cancel anytime. No questions asked.
      </p>
    </form>
  );
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Start Your Free Trial</h1>
          <p className="text-gray-600 mt-2">7 days free, then $29/month</p>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentForm />
        </Elements>
      </div>
    </div>
  )
}
