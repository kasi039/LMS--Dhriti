const express = require('express');
const router = express.Router();
const Applyloan = require('../controllers/Loanapplicationcontroller');

router.post('/applyLoan', Applyloan.createLoanApplication);

router.get('/applicationsbyuser', Applyloan.applications);

router.get('/allapplications', Applyloan.allapplications)

module.exports = router;
