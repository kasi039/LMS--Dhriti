const mongoose = require('mongoose');

const paymentschema = new mongoose.Schema({
    applicationId : {type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication'},
    userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    amount: Number,
    paymentDate: {type: Date, default: Date.now},
    paymentMethod: String,
});

module.exports = mongoose.model('Payment', paymentschema);