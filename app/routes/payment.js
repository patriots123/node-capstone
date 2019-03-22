'use strict';

const express = require('express');
const router = express.Router();
var moment = require('moment');

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


// router.get('/:id', (req, res) => {
//     User
//     .findById()
//     Payment
//     .findById(req.params.id)
//     .then(payment => res.json(payment))
//     .catch(err => {
//         console.error(err);
//         res.status(500).json({ message: 'Internal server error' });
//     });
// });

//called when creating a new payment from the payments screen
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
      numPaymentsMade: 0,
      totalAmountPaid: 0
    })
    // .then(payment => res.status(201).json(payment))
    .then(res.redirect('/payment'))
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

//DELETE that can be called through AJAX from client.js
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
    console.log( getNextPaymentDate(payment.nextPaymentDate, payment.frequency));
    console.log(updatedPayment);
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
  console.log(moment(nextPaymentDate).add(1, 'd').toDate());
  console.log('frequency:',frequency);
  let result;
  if (frequency.toLowerCase() == "daily") {
    result = moment(nextPaymentDate).add(1, 'd').toDate();
  } else if(frequency.toLowerCase() == "weekly") {
    result = moment(nextPaymentDate).add(1, 'w').toDate();
  } else if(frequency.toLowerCase() == "monthly") {
    result = moment(nextPaymentDate).add(1, 'm').toDate();
  } else if(frequency.toLowerCase() == "yearly") {
    result = moment(nextPaymentDate).add(1, 'y').toDate();
  }
  console.log('result:',result);
  return result;
}

module.exports = router;