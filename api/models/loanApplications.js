const mongoose = require('mongoose');
const { Schema } = mongoose;

const loanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   loanType: {
      type: String,
      enum: ['student', 'employee', 'business', 'home', 'car', 'gold', 'education', 'instant'],
      required: true,
    },
  amount: Number,

  details: {
      type: Schema.Types.Mixed,  
      default: {},
    },


  applicationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },





});

module.exports = mongoose.model('LoanApplication', loanSchema);
