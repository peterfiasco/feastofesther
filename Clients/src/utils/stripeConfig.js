// =============================================================================
// STRIPE CONFIGURATION - CLIENT SIDE
// =============================================================================

// Stripe Public Keys
export const STRIPE_PUBLIC_KEY_TEST = 'pk_test_51P0RdYP3S7SbpP7ytrPy8uKeqaSfADb7miKvMrK8zT7Gws0tNrBEjqL9lKdAQ6NrIxrTaQJBjTVYcFiXABpEXhXA00DNe1gyO7';
export const STRIPE_PUBLIC_KEY_LIVE = 'pk_live_51P0RdYP3S7SbpP7yHeZAUcgAt0n7Y6R4E7GhuMlntPmTQOjNjz9erHTea0foiSq2CPxZ3mGjyVvtFm7jbLerGonN00qZINK0iZ';

// Environment Mode (FORCE LIVE for testing - using working keys)
export const stripeMode = 'live'; // Force live mode to use working keys

// Get the appropriate public key based on environment
export const stripePublicKey = stripeMode === 'live' ? STRIPE_PUBLIC_KEY_LIVE : STRIPE_PUBLIC_KEY_TEST;

// Registration fee amount in cents/pennies
export const registrationFeeAmount = 12000; // $120.00
export const registrationFeeCurrency = 'usd';

// Debug logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Stripe Configuration:');
  console.log('Mode:', stripeMode);
  console.log('Public Key:', stripePublicKey.substring(0, 20) + '...');
  console.log('Registration Fee:', `$${registrationFeeAmount / 100}.00`);
}