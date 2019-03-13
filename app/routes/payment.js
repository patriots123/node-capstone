'use strict';

const express = require('express');
const router = express.Router();

const { Payment } = require('../models/payment');
const { User } = require('../models/user');

router.get('/', (req, res) => {
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

router.post('/:id/user/:userID', (req,res) => {
  Payment.findOne({_id: req.params.id})
    .then((payment) => {
      payment.user = userID;
      return payment.save();
    })
    .then((payment) => {
      res.send(payment).status(200)
    })
    .catch(err => {
      res.json({message: 'this didnt work'});
    });
});

router.post('/', (req, res) => {
  const requiredFields = ['amount', 'description', 'paymentDate','frequency'];
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
      paymentDate: req.body.paymentDate,
      frequency: req.body.frequency
    })
    .then(payment => res.status(201).json(payment))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });
});

router.put('/:id', (req, res) => {
    if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      res.status(400).json({
        error: 'Request path id and request body id values must match'
      });
    }

    const updated = {};
    const updateableFields = ['amount', 'description', 'paymentDate','frequency'];
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
        paymentDate: updatedPayment.paymentDate,
        frequency: updatedPayment.frequency
      }))
      .catch(err => res.status(500).json({ message: err }));
});

router.delete('/:id', (req, res) => {
  Payment
    .findByIdAndRemove(req.params.id)
    .then(() => {
      console.log(`Deleted payment with id \`${req.params.id}\``);
      res.status(204).end();
    });
});

module.exports = router;