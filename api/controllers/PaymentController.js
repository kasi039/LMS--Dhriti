const Payment = require('../models/Payment');
const Loan = require('../models/loanApplications');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createStripeCheckout = async(req, res) => {
    const {applicationId, amount} = req.body;
    const loan = await Loan.findById(applicationId);

    const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'cad',
        product_data: { name: `Loan repayment for ${applicationId}` },
        unit_amount: amount * 100, // Stripe expects cents
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `http://localhost:3000/payment-success?applicationId=${applicationId}`,
    cancel_url: `http://localhost:3000/payment-failed`,
    });

    res.json({url: session.url});
}

exports.postPayment = async(req, res) => {
    const {applicationId, amount, method} = req.body;
    const userId = req.session.user?.id; 
    const payment = new Payment ({applicationId, userId, amount, paymentMethod: method});
    await payment.save();

    const loan = await Loan.findById(applicationId);
    loan.remainingAmount -= amount;
    await loan.save();

    res.json({message: 'Payment Successfull', payment});
}

