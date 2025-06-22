const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Registration = require('../models/registrationModel');
const fs = require('fs');
const path = require('path');

// Store registration data in a file if server restarts
const PENDING_REGISTRATIONS_FILE = path.join(__dirname, '../../pending-registrations.json');

// Load any existing pending registrations
let pendingRegistrationsData = {};
try {
  if (fs.existsSync(PENDING_REGISTRATIONS_FILE)) {
    pendingRegistrationsData = JSON.parse(fs.readFileSync(PENDING_REGISTRATIONS_FILE, 'utf8'));
    console.log('Loaded pending registrations from file');
  }
} catch (error) {
  console.error('Error loading pending registrations:', error);
}

const pendingRegistrations = new Map(Object.entries(pendingRegistrationsData));

// Track processed sessions to prevent duplicates
const processedSessions = new Set();

// Function to save pending registrations to file
const savePendingRegistrations = () => {
  try {
    const data = Object.fromEntries(pendingRegistrations);
    fs.writeFileSync(PENDING_REGISTRATIONS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving pending registrations:', error);
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    console.log('Received data for checkout:', req.body);
    const registrationData = req.body;

    // Check if Stripe is properly configured
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('your_stripe_secret_key_here')) {
      return res.status(400).json({
        success: false,
        message: 'Stripe is not configured. Please add your Stripe API keys to the .env file.',
        error: 'STRIPE_NOT_CONFIGURED'
      });
    }

    // Validate required fields
    if (!registrationData || !registrationData.firstname || !registrationData.lastname) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration data. First name and last name are required.'
      });
    }

    // Check for duplicate registration attempts by email within a short time window
    const existingRegistration = Array.from(pendingRegistrations.values())
      .find(reg => reg.email === registrationData.email);
    
    if (existingRegistration) {
      const registrationTime = parseInt(Array.from(pendingRegistrations.keys())
        .find(key => pendingRegistrations.get(key).email === registrationData.email));
      
      // If registration was created within the last 5 minutes, prevent duplicate
      if (Date.now() - registrationTime < 5 * 60 * 1000) {
        console.log('Duplicate registration attempt prevented for:', registrationData.email);
        return res.status(400).json({
          success: false,
          message: 'A registration for this email is already being processed. Please wait a few minutes before trying again.'
        });
      }
    }

    // Store the registration data with a unique ID
    const registrationId = Date.now().toString();
    pendingRegistrations.set(registrationId, registrationData);
    savePendingRegistrations(); // Save to file

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Feast of Esther 2025 Registration',
              description: `Registration for ${registrationData.firstname} ${registrationData.lastname}`,
            },
            unit_amount: 12000, // $120.00 in cents - updated to match client config
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/registration-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/registration`,
      metadata: {
        registrationId: registrationId,
        email: registrationData.email,
      },
    });

    res.json({ 
      success: true,
      url: session.url, 
      sessionId: session.id 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create checkout session',
      error: error.message 
    });
  }
};

exports.verifySession = async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Session ID is required' 
      });
    }

    // Check if this session has already been processed
    if (processedSessions.has(sessionId)) {
      console.log('Session already processed:', sessionId);
      return res.json({ success: true });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Mark session as processed
      processedSessions.add(sessionId);
      
      // Payment was successful
      // Check if we need to save the registration (as a fallback if webhook failed)
      const registrationId = session.metadata.registrationId;

      if (registrationId && pendingRegistrations.has(registrationId)) {
        try {
          // Get the registration data
          const registrationData = pendingRegistrations.get(registrationId);

          // Save to database
          await Registration.create(registrationData);

          // Remove from pending registrations
          pendingRegistrations.delete(registrationId);
          savePendingRegistrations(); // Save to file

          console.log('Registration saved during verification (webhook fallback)');
        } catch (error) {
          console.error('Error saving registration during verification:', error);
        }
      }

      return res.json({ success: true });
    } else {
      return res.json({ 
        success: false, 
        message: 'Payment not completed' 
      });
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error verifying payment' 
    });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Log the webhook secret to verify it's being used
    console.log('Using webhook secret:', process.env.STRIPE_WEBHOOK_SECRET ? 'Secret exists' : 'Secret missing');

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook event received:', event.type);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Payment session completed:', session.id);

    // Check if this session has already been processed
    if (processedSessions.has(session.id)) {
      console.log('Webhook: Session already processed:', session.id);
      return res.json({ received: true });
    }

    try {
      // Mark session as processed
      processedSessions.add(session.id);

      // Get the registration ID from the metadata
      const registrationId = session.metadata.registrationId;
      console.log('Registration ID from metadata:', registrationId);

      if (registrationId && pendingRegistrations.has(registrationId)) {
        // Get the registration data
        const registrationData = pendingRegistrations.get(registrationId);
        console.log('Found pending registration data:', registrationData.email);

        // Check if registration already exists in database
        const existingRegistration = await Registration.findOne({ 
          email: registrationData.email 
        });

        if (existingRegistration) {
          console.log('Registration already exists for:', registrationData.email);
          // Remove from pending registrations
          pendingRegistrations.delete(registrationId);
          savePendingRegistrations();
          return res.json({ received: true });
        }

        // Save to database since payment was successful
        const result = await Registration.create(registrationData);
        console.log('Registration saved to database:', result);

        // Remove from pending registrations
        pendingRegistrations.delete(registrationId);
        savePendingRegistrations(); // Save to file
      } else {
        console.error('Registration ID not found in pending registrations');
      }
    } catch (error) {
      console.error('Error processing successful payment webhook:', error);
    }
  }

  res.json({ received: true });
};