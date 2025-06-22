const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.post('/create-registration', registrationController.createRegistration);
// In your main API routes file, add:
router.post('/create-paypal-orders', registrationController.createPayPalOrder);
router.get('/verify-paypal-payment', registrationController.verifyPayPalPayment);

module.exports = router;
