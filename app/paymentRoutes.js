
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

app.post('/payments', (req, res) => {
  const requiredFields = ['amount', 'description', 'paymentDate'];
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
      paymentDate: req.body.paymentDate
    })
    .then(payment => res.status(201).json(payment))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Something went wrong' });
    });

});
}