'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const paymentSchema = mongoose.Schema({
  amount: Number,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nextPaymentDate: Date,
  frequency: String,
  createdDate: {type: Date, default: Date.now},
  numPayments: Number,
  totalAmountPaid: Number
});

// paymentSchema.pre('find', function(next) {
//   this.populate('user');
//   next();
// });

// paymentSchema.pre('findOne', function(next) {
//   this.populate('user');
//   next();
// });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {Payment};
