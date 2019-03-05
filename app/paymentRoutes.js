
const { Payment } = require('./models/payment');

module.exports = function(app, passport) {

    app.get('/payments', (req, res) => {
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

    app.get('/payments/:id', (req, res) => {
        Payment
        .findById(req.params.id)
        .then(payment => res.json(payment))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
    });

    app.post('/payments', (req, res) => {
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

    app.put('/payments/:id', (req, res) => {
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

    app.delete('/payments/:id', (req, res) => {
      Payment
        .findByIdAndRemove(req.params.id)
        .then(() => {
          console.log(`Deleted payment with id \`${req.params.id}\``);
          res.status(204).end();
        });
    });
}