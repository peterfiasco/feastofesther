const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/create-donation', donationController.createDonation);
router.post('/create-contribution-session', donationController.createContributionSession);
router.post('/create-paypal-order', donationController.createPayPalOrder);
router.get('/verify-donation-session', donationController.verifyDonationSession);
router.get('/verify-paypal-payment', donationController.verifyPayPalPayment);

module.exports = router;