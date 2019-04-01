'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const {app} = require('../server');

chai.use(chaiHttp);

describe("test payment route HTTP requests", function() {
  describe("test index page successfully loads", function() {
      describe("test root", function() {
          it ("should exist and return 200", () => {
            return chai.request(app)
              .get('/')
              .then((res) => {
                expect(res).to.have.status(200);
              })
          });
      });

      describe("test GET /login", function() {
        it ("should exist and return 200", () => {
          return chai.request(app)
            .get('/')
            .then((res) => {
              expect(res).to.have.status(200);
            })
        });
      });

      describe("test GET /signup", function() {
        it ("should exist and return 200", () => {
          return chai.request(app)
            .get('/')
            .then((res) => {
              expect(res).to.have.status(200);
            })
        });
      });

      describe("test GET /payment", function() {
        it ("should exist and return 200", () => {
          return chai.request(app)
            .get('/')
            .then((res) => {
              expect(res).to.have.status(200);
            })
        });
      });
  });
});