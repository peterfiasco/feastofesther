const db = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const { sendDonationConfirmation, sendAdminNotification } = require('../services/emailService');

// PayPal environment setup
const getPayPalEnvironment = () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  
  if (process.env.NODE_ENV === 'production') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
};

const paypalClient = new paypal.core.PayPalHttpClient(getPayPalEnvironment());

// Track processed orders to prevent duplicates
const processedOrders = new Set();

// Create donation record
exports.createDonation = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, amount } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const [result] = await db.execute(
      'INSERT INTO donations (first_name, last_name, email, phone, amount) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, phone, amount]
    );

    const donationId = result.insertId;

    // Send confirmation email (don't wait for it to complete)
    sendDonationConfirmation({ firstName, lastName, email, phone, amount }).catch(error => {
      console.error('Failed to send donation confirmation email:', error);
    });
    
    // Send admin notification (don't wait for it to complete)
    sendAdminNotification('donation', { firstName, lastName, email, phone, amount }).catch(error => {
      console.error('Failed to send admin notification email:', error);
    });

    res.status(201).json({
      success: true,
      message: 'Contribution information saved',
      donationId: donationId
    });

  } catch (error) {
    console.error('Error saving contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save contribution information'
    });
  }
};

// Create Stripe contribution session
exports.createContributionSession = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, amount, donationId } = req.body;
    
    const amountInCents = Math.round(parseFloat(amount) * 100);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Ministry Support',
            description: 'Support for Feast of Esther Ministries'
          },
          unit_amount: amountInCents
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: process.env.CLIENT_URL + '/donation-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: process.env.CLIENT_URL + '/donate',
      metadata: {
        donationId: donationId.toString(),
        email: email,
        type: 'contribution'
      }
    });

    // Update donation record with session ID
    await db.execute(
      'UPDATE donations SET session_id = ? WHERE id = ?',
      [session.id, donationId]
    );

    res.json({
      url: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error('Error creating contribution session:', error);
    res.status(500).json({
      message: 'Failed to create contribution session'
    });
  }
};

// Handle Stripe webhook for donations
exports.handleDonationWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook event received:', event.type);
  } catch (err) {
    console.error('Webhook Error: ' + err.message);
    return res.status(400).send('Webhook Error: ' + err.message);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    if (session.metadata && session.metadata.type === 'contribution') {
      try {
        const donationId = session.metadata.donationId;
        
        await db.execute(
          'UPDATE donations SET payment_status = ?, payment_intent_id = ? WHERE id = ?',
          ['completed', session.payment_intent, donationId]
        );

        console.log('Contribution ' + donationId + ' marked as completed');
      } catch (error) {
        console.error('Error processing contribution webhook:', error);
      }
    }
  }

  res.json({ received: true });
};

// Verify donation session
exports.verifyDonationSession = async (req, res) => {
  try {
    const { sessionId } = req.query;
    
    console.log('Verifying donation session:', sessionId);
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('Session payment status:', session.payment_status);

    if (session) {
      if (session.metadata && session.metadata.donationId) {
        try {
          await db.execute(
            'UPDATE donations SET session_verified = TRUE WHERE session_id = ?',
            [sessionId]
          );
        } catch (error) {
          console.error('Database update error:', error);
        }
      }

      return res.json({
        success: true,
        paymentStatus: session.payment_status
      });
    } else {
      return res.json({
        success: false,
        message: 'Payment session not found'
      });
    }

  } catch (error) {
    console.error('Error verifying session:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
};

// Create PayPal order for donations
exports.createPayPalOrder = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, amount, donationId } = req.body;
    
    if (!amount || !firstName || !lastName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for PayPal payment'
      });
    }

    const formattedAmount = parseFloat(amount).toFixed(2);
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: formattedAmount
        },
        description: 'Donation to Feast of Esther Ministries',
        custom_id: donationId.toString()
      }],
      application_context: {
        brand_name: 'Feast of Esther Ministries',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: process.env.CLIENT_URL + '/donation-success',
        cancel_url: process.env.CLIENT_URL + '/donate'
      }
    });

    const order = await paypalClient.execute(request);
    
    // Update donation record with PayPal order info
    if (donationId) {
      await db.execute(
        'UPDATE donations SET payment_method = ?, session_id = ? WHERE id = ?',
        ['paypal', order.result.id, donationId]
      );
    }

    const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;

    return res.json({
      success: true,
      orderId: order.result.id,
      url: approvalUrl
    });

  } catch (error) {
    console.error('PayPal order creation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating PayPal payment',
      error: error.message
    });
  }
};

// Verify PayPal payment
exports.verifyPayPalPayment = async (req, res) => {
  try {
    const { token, PayerID } = req.query;
    
    if (!token || !PayerID) {
      return res.status(400).json({
        success: false,
        message: 'Missing PayPal token or PayerID'
      });
    }

    console.log('Verifying PayPal payment:', token, PayerID);

    // Check if this order has already been processed
    if (processedOrders.has(token)) {
      console.log('PayPal order already processed:', token);
      return res.json({ success: true });
    }

    const getRequest = new paypal.orders.OrdersGetRequest(token);
    const getResponse = await paypalClient.execute(getRequest);

    if (getResponse.result.status === 'COMPLETED') {
      processedOrders.add(token);
      await updatePaymentStatus(token);
      return res.json({ success: true });
    }

    if (getResponse.result.status === 'APPROVED') {
      const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
      captureRequest.requestBody({});
      
      const captureResponse = await paypalClient.execute(captureRequest);
      
      if (captureResponse.result.status === 'COMPLETED') {
        processedOrders.add(token);
        await updatePaymentStatus(token);
        return res.json({ success: true });
      }
    }

    return res.json({
      success: false,
      message: 'Payment not completed',
      status: getResponse.result.status
    });

  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
};

// Helper function to update payment status
async function updatePaymentStatus(orderId) {
  try {
    await db.execute(
      'UPDATE donations SET payment_status = ? WHERE session_id = ?',
      ['completed', orderId]
    );
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}