const express = require('express');
const router = express.Router();
const Applyloan = require('../controllers/Loanapplicationcontroller');

router.post('/applyLoan', Applyloan.createLoanApplication);

router.get('/applicationsbyuser', Applyloan.applications);

module.exports = router;
