// =============================================================================
// PAYPAL CONFIGURATION - CLIENT SIDE
// =============================================================================

// PayPal Client IDs
export const PAYPAL_CLIENT_ID_SANDBOX = 'AYsqN5awNLVelFNiuOaAHSmWe-YrM9xuy_ZKbReEnanLlJNz7HjKoHrFdykdO6hl2nF7DgfJD0eQrtIf';
export const PAYPAL_CLIENT_ID_LIVE = 'ARHcLPUKYzfQoZgTT-xSc0k-fvyYwJNO52YdYLKyuyXKW4hpDn1fdxTHE9sI11jto77q45vFzKS_rCMS';

// Environment Mode (FORCE LIVE for testing - using working keys)
export const paypalMode = 'live'; // Force live mode to use working keys

// Get the appropriate client ID based on environment
export const paypalClientId = paypalMode === 'live' ? PAYPAL_CLIENT_ID_LIVE : PAYPAL_CLIENT_ID_SANDBOX;

// Debug logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 PayPal Configuration:');
  console.log('Mode:', paypalMode);
  console.log('Client ID:', paypalClientId.substring(0, 20) + '...');
}