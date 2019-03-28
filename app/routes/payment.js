'use strict';

const express = require('express');
const router = express.Router();
var moment = require('moment');

const { Payment } = require('../models/payment');

router.get('/', isLoggedIn, function(req, res) {
  Payment.find({user:req.user._id})
      .then(payments => {
          res.json(payments).render('pages/payment.ejs', {
              user : req.user,
              payments: sortUserPayments(payments),
              moment: moment
          });
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'unable to get payments' });
        });
});

router.get('/testget', (req, res) => {
  Payment.find()
      .then(payments => {
          res.json(payments)
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ error: 'unable to get payments' });
        });
});

//called when creating a new payment from the payments screen
router.post('/', (req, res) => {
  const requiredFields = ['amount', 'description', 'nextPaymentDate','frequency'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Payment
    .create({
      amount: req.body.amount,
      description: req.body.description,
      nextPaymentDate: req.body.nextPaymentDate,
      frequency: req.body.frequency,
      paymentWebsite: req.body.paymentWebsite,
      user: req.user._id,
      numPaymentsMade: 0,
      totalAmountPaid: 0
    })
    .then(res.status(201).redirect('/payment'))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

router.post('/testpost', (req,res)=>{
  const requiredFields = ['amount', 'description', 'nextPaymentDate','frequency'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Payment
    .create({
      amount: req.body.amount,
      description: req.body.description,
      nextPaymentDate: req.body.nextPaymentDate,
      frequency: req.body.frequency,
      paymentWebsite: req.body.paymentWebsite,
      // user: req.user._id,
      numPaymentsMade: 0,
      totalAmountPaid: 0
    })
    .then(payment => res.status(201).json(payment))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

router.delete('/testdelete/:id', (req, res) => {
  Payment
    .findOneAndRemove({_id:req.params.id})
    .then(() => {
      console.log(`Deleted payment with id \`${req.params.id}\``);
      res.send(200)
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

//delete payment when card link is clicked
router.get('/delete/:id', isLoggedIn, (req,res)=> {
  Payment
    .findOneAndRemove({_id:req.params.id, user:req.user._id})
    .then(() => {
      console.log(`Deleted payment with id \`${req.params.id}\``);
      res.redirect('/payment');
    })
    .catch(err => {
      res.send(500).message("something went wrong")
    })
});

//update payment information when card link is clicked
router.post('/update/:id', (req,res) => {
  const updated = {};
  const updateableFields = ['amount', 'description', 'nextPaymentDate','frequency'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Payment
    .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(() => {
      res.redirect('/payment');
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

//incement historical data fields on payment and change next payment date when link is clicked on card
router.get('/completed/:id', (req,res) => {
  let updatedPayment = {};
  Payment.findById(req.params.id)
  .then(payment => {
    updatedPayment.totalAmountPaid = payment.totalAmountPaid + payment.amount;
    updatedPayment.numPaymentsMade = payment.numPaymentsMade + 1;
    updatedPayment.nextPaymentDate = getNextPaymentDate(payment.nextPaymentDate, payment.frequency)+"";

    Payment.findByIdAndUpdate(req.params.id, updatedPayment, {new: true})
    .then(res.redirect('/payment'))
  })
  .catch(err => {
    res.send(500).message("something went wrong")
  })
});

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

//button on front end will trigger this for an individual payment
function getNextPaymentDate(nextPaymentDate, frequency) {
  let result;
  if (frequency.toLowerCase() == "daily") {
    result = moment(nextPaymentDate).add(1, 'd').toDate();
  } else if(frequency.toLowerCase() == "weekly") {
    result = moment(nextPaymentDate).add(1, 'w').toDate();
  } else if(frequency.toLowerCase() == "monthly") {
    console.log(nextPaymentDate);
    result = moment(nextPaymentDate).add(1, 'M').toDate();
    console.log(result);
  } else if(frequency.toLowerCase() == "yearly") {
    result = moment(nextPaymentDate).add(1, 'y').toDate();
  }
  return result;
}

module.exports = router;