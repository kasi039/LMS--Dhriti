const express = require('express');
const router = express.Router();

const Payment = require('../controllers/PaymentController');

router.post('/create-TheStripe-Section', Payment.createStripeCheckout);

router.post('/createPayment', Payment.postPayment);

router.get('/getallpayments', Payment.getAllPayments)

module.exports = router;