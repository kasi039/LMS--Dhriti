const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication' },
  fileName: String,
  fileType: String,
  data: Buffer, 
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Document', documentSchema);

