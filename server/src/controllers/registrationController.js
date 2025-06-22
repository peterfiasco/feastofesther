const Registration = require('../models/registrationModel');
const db = require('../config/db'); // Add this line to import the database module
const paypal = require('@paypal/checkout-server-sdk');
const { sendRegistrationConfirmation, sendAdminNotification } = require('../services/emailService');

exports.createRegistration = async (req, res) => {
  try {
    const registrationData = req.body;
    
    // Basic validation
    if (!registrationData.firstname || !registrationData.lastname || !registrationData.email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Required fields are missing' 
      });
    }
    
    const result = await Registration.create(registrationData);
    
    // Send confirmation email (don't wait for it to complete)
    sendRegistrationConfirmation(registrationData).catch(error => {
      console.error('Failed to send registration confirmation email:', error);
    });
    
    // Send admin notification (don't wait for it to complete)
    sendAdminNotification('registration', registrationData).catch(error => {
      console.error('Failed to send admin notification email:', error);
    });
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};


exports.createPayPalOrder = async (req, res) => {
  try {
    const { registrationId, firstName, lastName, email, amount, currency = 'USD' } = req.body;
    
    // Check if PayPal is properly configured
    if (!process.env.PAYPAL_CLIENT_ID || process.env.PAYPAL_CLIENT_ID.includes('your_paypal_client_id_here')) {
      return res.status(400).json({
        success: false,
        message: 'PayPal is not configured. Please add your PayPal API keys to the .env file.',
        error: 'PAYPAL_NOT_CONFIGURED'
      });
    }
    
    // Validate the required fields
    if (!amount || !registrationId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields for PayPal payment'
      });
    }
    
    // Format amount properly for PayPal (e.g., "10.00")
    const formattedAmount = parseFloat(amount).toFixed(2);
    
    // Set up PayPal environment
    let environment;
    if (process.env.NODE_ENV === 'production') {
      environment = new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
    } else {
      environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
    }
    
    const client = new paypal.core.PayPalHttpClient(environment);
    
    // Create a PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: currency,
          value: formattedAmount
        },
        description: 'Registration for Feast of Esther Event',
        custom_id: registrationId.toString()
      }],
      application_context: {
        brand_name: 'Feast of Esther Ministries',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.CLIENT_URL}/registration-success?source=paypal`,
        cancel_url: `${process.env.CLIENT_URL}/register`
      }
    });
    
    const order = await client.execute(request);
    
    // Update the registration record with the PayPal order ID
    if (registrationId) {
      await db.query(
        'UPDATE registrations SET payment_method = ?, payment_id = ? WHERE id = ?',
        ['paypal', order.result.id, registrationId]
      );
    }
    
    // Find the approval URL to redirect to PayPal
    const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;
    
    return res.json({
      success: true,
      orderId: order.result.id,
      approvalUrl: approvalUrl
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

exports.verifyPayPalPayment = async (req, res) => {
  try {
    const { token, PayerID } = req.query;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'Missing PayPal token' });
    }
    
    console.log("Verifying PayPal payment:", token, PayerID);
    
    // PayPal requires the capture step to complete the payment
    const paypal = require('@paypal/checkout-server-sdk');
    let environment;
    
    if (process.env.NODE_ENV === 'production') {
      environment = new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID, 
        process.env.PAYPAL_CLIENT_SECRET
      );
    } else {
      environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      );
    }
    
    const client = new paypal.core.PayPalHttpClient(environment);
    
    // Get order details
    const request = new paypal.orders.OrdersGetRequest(token);
    const order = await client.execute(request);
    
    // If PayerID is provided and order is approved but not captured yet, capture it
    if (PayerID && order.result.status === 'APPROVED') {
      const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
      captureRequest.requestBody({});
      
      const captureResponse = await client.execute(captureRequest);
      
      if (captureResponse.result.status === 'COMPLETED') {
        // Update registration status in database
        await db.query(
          'UPDATE registrations SET payment_status = ? WHERE payment_id = ?',
          ['completed', token]
        );
        return res.json({ success: true, message: 'Payment completed successfully' });
      }
    }
    
    // If the order is already completed
    if (order.result.status === 'COMPLETED') {
      await db.query(
        'UPDATE registrations SET payment_status = ? WHERE payment_id = ?',
        ['completed', token]
      );
      return res.json({ success: true, message: 'Payment verified successfully' });
    }
    
    return res.json({ 
      success: false, 
      message: 'Payment not completed', 
      status: order.result.status 
    });
    
  } catch (error) {
    console.error('Error verifying PayPal payment:', error);
    return res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
};