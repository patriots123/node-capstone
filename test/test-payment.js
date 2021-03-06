'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const id = require('mongoose').Types.ObjectId();
const moment = require('moment');

const expect = chai.expect;

const {Payment} = require('../app/models/payment');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config/database.js');

chai.use(chaiHttp);

function seedPaymentData() {
  console.info('seeding payment data');
  for (let i=1; i<=10; i++) {
    Payment.create(generatePaymentSeedData());
  }
}

function generatePaymentSeedData() {
  return {
    amount: faker.random.number({
        'min': 50,
        'max': 1000
    }),
    description: faker.lorem.sentence(),
    frequency: "Monthly",
    paymentWebsite: faker.internet.domainName(),
    nextPaymentDate: faker.date.future(),
    numPaymentsMade: 0,
    totalAmountPaid: 0,
    user: id
  };
}

function tearDownDb() {
  return mongoose.connection.dropDatabase();
}


describe("test payment route HTTP requests", function() {

    before(function() {
      return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
      return seedPaymentData();
    });

    afterEach(function() {
      return tearDownDb();
    });

    after(function() {
      return closeServer();
    });

    describe("test GET /payments", function() {
        it ("should return all existing payments posts for a user", () => {
          return chai.request(app)
            .get('/payments')
            .then(function(res) {
              expect(res).to.have.status(200);
            })
        });
    })

    describe("test POST /payments", function() {
        it('should create a new payment', function() {
          const newPayment = generatePaymentSeedData();
          return chai.request(app)
            .post('/payments/testpost')
            .send(newPayment)
            .then((res) => {
              expect(res).to.have.status(201);
            })
        });
    })

    describe("test GET /payments/delete/:id", function() {
        it('should delete a payment', function() {
            let payment;
            return Payment
              .findOne()
              .then(function(_payment) {
                  payment = _payment
                  return chai.request(app)
                  .get(`/payments/delete/${_payment._id}`);
              })
              .then(function(res) {
                  expect(res).to.have.status(200);
              })
        });
    })

    // describe("test POST /payments/update/:id", function() {
    //     it('should update payment', function() {
    //       const newPayment = generatePaymentSeedData();
    //     //   console.log(newPayment);
    //       return Payment.findOne()
    //       .then(function(res) {
    //           return chai.request(app)
    //           .post(`/payments/update/${newPayment._id}`)
    //         // .send(newPayment)
    //           .then((res) => {
    //               expect(res).to.have.status(201);
    //         })
    //     })
    //     })
    // })

    describe("test GET /payments/completed/:id", function() {
        it('should update totalAmountPaid, numPaymentsMade, nextPaymentDate', function() {
            let payment;
            return Payment
              .findOne()
              .then(function(_payment) {
                  payment = _payment;
                  return chai.request(app)
                  .get(`/payments/completed/${_payment._id}`);
              })
              .then(function(res) {
                  expect(res).to.have.status(200);
              })  
        });
    })
});