const express = require('express');
const router = express.Router();
const Applyloan = require('../controllers/Loanapplicationcontroller');

router.post('/applyLoan', Applyloan.createLoanApplication);

router.get('/applicationsbyuser', Applyloan.applications);

router.get('/allapplications', Applyloan.allapplications)

router.put('/statusupdate/:id', Applyloan.statusupdate);

router.get('/getapplicationdetails/:id', Applyloan.getapplicationdetails);

router.delete('/applicationdelete/:id', Applyloan.deleteapplication)

module.exports = router;
