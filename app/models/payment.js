'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const paymentSchema = mongoose.Schema({
  amount: Number,
  description: String,
  frequency: String,
  paymentWebsite: String,
  nextPaymentDate: Date,
  createdDate: {type: Date, default: Date.now},
  numPaymentsMade: Number,
  totalAmountPaid: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {Payment};
