'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const paymentSchema = mongoose.Schema({
  amount: Number,
  description: String,
  user: String,
  paymentDate: Date,
  createdDate: {type: Date, default: Date.now}
});


// blogPostSchema.virtual('authorName').get(function() {
//   return `${this.author.firstName} ${this.author.lastName}`.trim();
// });

// blogPostSchema.methods.serialize = function() {
//   return {
//     id: this._id,
//     author: this.authorName,
//     content: this.content,
//     title: this.title,
//     created: this.created
//   };
// };

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = {Payment};
