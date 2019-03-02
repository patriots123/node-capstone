'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

//const { Payment } = require('../app/models/payment');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config/database.js');

chai.use(chaiHttp);

describe("first test", function() {

    before(function() {
      return runServer(TEST_DATABASE_URL);
    });

    after(function() {
      return closeServer();
    });

    describe("test root", function() {

        it ("should return 200", () => {
          let res;
          return chai.request(app)
            .get('/')
            .then(function(res) {
              expect(res).to.have.status(200);
            })
        });
    });

});