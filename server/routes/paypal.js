const express = require('express');
const router = express.Router();
const paypal = require('@paypal/checkout-server-sdk');

// Configure PayPal environment
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const environment = process.env.NODE_ENV === 'production'
  ? new paypal.core.LiveEnvironment(clientId, clientSecret)
  : new paypal.core.SandboxEnvironment(clientId, clientSecret);
const client = new paypal.core.PayPalHttpClient(environment);

// Track processed orders to prevent duplicates
const processedOrders = new Set();

// Create a PayPal order for registration
router.post('/create-paypal-order', async (req, res) => {
  try {
    const { registrationId, name, email, amount, currency, returnUrl, cancelUrl } = req.body;
    
    // Validate required fields
    if (!registrationId || !name || !email || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for PayPal order creation'
      });
    }
    
    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: registrationId,
        amount: {
          currency_code: currency || 'USD',
          value: amount.toString()
        },
        description: 'Feast of Esther Registration'
      }],
      application_context: {
        brand_name: 'Feast of Esther',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: returnUrl || `${process.env.CLIENT_URL}/registration-success`,
        cancel_url: cancelUrl || `${process.env.CLIENT_URL}/registration`,
        shipping_preference: 'NO_SHIPPING'
      }
    });
    
    // Execute the request
    const order = await client.execute(request);
    
    // Extract the approval URL
    const approvalUrl = order.result.links.find(link => link.rel === "approve").href;
    
    res.json({
      success: true,
      orderId: order.result.id,
      approvalUrl: approvalUrl
    });
  } catch (error) {
    console.error('PayPal order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create PayPal order',
      error: error.message
    });
  }
});

// Capture PayPal payment
router.post('/capture-paypal-payment', async (req, res) => {
  try {
    const { orderID } = req.body;
    
    if (!orderID) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    // Check if this order has already been processed
    if (processedOrders.has(orderID)) {
      console.log('PayPal order already processed:', orderID);
      return res.json({ 
        success: true,
        message: 'Order already processed'
      });
    }

    // Capture the payment
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
    
    const capture = await client.execute(request);
    
    if (capture.result.status === 'COMPLETED') {
      // Mark order as processed
      processedOrders.add(orderID);
      
      res.json({
        success: true,
        captureID: capture.result.id,
        status: capture.result.status
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment capture failed',
        status: capture.result.status
      });
    }
    
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to capture PayPal payment',
      error: error.message
    });
  }
});

module.exports = router;