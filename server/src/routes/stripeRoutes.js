const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripeController');

// Use raw body parser for webhook
const rawBodyParser = express.raw({type: 'application/json'});

router.post('/create-checkout-session', stripeController.createCheckoutSession);
// Make sure this matches the endpoint you configured in Stripe
router.post('/webhook', rawBodyParser, stripeController.handleWebhook);
router.get('/verify-session', stripeController.verifySession);

module.exports = router;
