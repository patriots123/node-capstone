'use strict';

const express = require('express');
const router = express.Router();

const { Payment } = require('../models/payment');
const { User } = require('../models/user');

router.get('/', isLoggedIn, (req, res) => {
  Payment
    .find({user: req.user._id})
    .then(payments => {
      res.json(payments);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

router.get('/testget', (req, res) => {
  Payment
    .find()
    .then(payments => {
      res.json(payments);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});


router.get('/:id', (req, res) => {
    User
    .findById()
    Payment
    .findById(req.params.id)
    .then(payment => res.json(payment))
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', isLoggedIn, (req, res) => {
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
      user: req.user._id,
      numPayments: 0,
      totalAmountPaid: 0
    })
    .then(payment => res.status(201).json(payment))
    .then(res.redirect('/profile'))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

router.post('/testpost', (req,res)=>{
  res.send({body: req.body, user: req.user});
});

router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }

    const updated = {};
    const updateableFields = ['amount', 'description', 'nextPaymentDate','frequency'];
    updateableFields.forEach(field => {
      if (field in req.body) {
        updated[field] = req.body[field];
      }
    });

    Payment
      .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
      .then(updatedPayment => res.status(200).json({
        id: updatedPayment.id,
        amount: updatedPayment.amount,
        description: updatedPayment.description,
        nextPaymentDate: updatedPayment.nextPaymentDate,
        frequency: updatedPayment.frequency
      }))
      .catch(err => res.status(500).json({ message: err }));
});

router.delete('/:id', isLoggedIn, (req, res) => {
  Payment
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted payment with id \`${req.params.id}\``);
      res.status(204).end();
    });
});

router.delete('/testdelete/:id', (req, res) => {
  Payment
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted payment with id \`${req.params.id}\``);
      res.status(204).end();
    });
});

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}

function billPaid() {

}

//button on front end will trigger this for an individual payment
function getNextPaymentDate(nextPaymentDate, frequency) {
  if (frequency = "daily") {
    return nextPaymentDate.setDate(nextPaymentDate.getDate() + 1)
  } else if(frequency = "weekly") {
    return nextPaymentDate.setDate(nextPaymentDate.getDate() + 7)
  } else if(frequency = "monthly") {
    return nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  } else if(frequency = "yearly") {
    return nextPaymentDate.setMonth(nextPaymentDate.getFullYear() + 1);
  }
}

module.exports = router;