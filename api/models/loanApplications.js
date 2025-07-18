const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loantype: String,
  amount: Number,
  applicationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  //Student loan
  institutionName: String,
  courseDurattion: Number,

  //Home-loan
  propertyValue: Number,
  downPayment: Number,
  address: String,

  //Car-loan
  carMake: String,
  carModel: String,
  carYear: Number


});

module.exports = mongoose.model('LoanApplication', loanSchema);
