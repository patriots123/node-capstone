'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const expect = chai.expect;

const { Payment } = require('../app/models/payment');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL, PORT} = require('../config/database.js');

chai.use(chaiHttp);

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

// describe("test blogp posts HTTP requests", function() {

//   before(function() {
//     return runServer(TEST_DATABASE_URL);
//   });

//   beforeEach(function() {
//     return seedBlogPostData();
//   });

//   afterEach(function() {
//     return tearDownDb();
//   });

//   after(function() {
//     return closeServer();
//   });

//   describe("test GET endpoint", function() {
//       it ("should return all existing blog posts", () => {
//         let res;
//         return chai.request(app)
//           .get('/posts')
//           .then(function(_res) {
//             res = _res;
//             expect(res).to.have.status(200);
//             expect(res.body).to.have.lengthOf.at.least(1);
//             return BlogPost.count();
//           })
//           .then(function(count) {
//             expect(res.body).to.have.lengthOf(count);
//           });
//       });

//       it ("should return single blog post", () => {
//           let resBlogPost;
//           return chai.request(app)
//             .get('/posts')
//             .then(function(res) {
//               expect(res).to.have.status(200);
//               expect(res).to.be.json;
//               expect(res.body).to.be.a('array');
//               expect(res.body).to.have.lengthOf.at.least(1);
    
//               res.body.forEach(function(blogPost) {
//                 expect(blogPost).to.be.a('object');
//                 expect(blogPost).to.include.keys(
//                   'id', 'title', 'author', 'content', 'created');
//               });
//               resBlogPost = res.body[0];
//               return BlogPost.findById(resBlogPost.id);
//             })
//             .then(function(blogPost) {
    
//               expect(resBlogPost.id).to.equal(blogPost.id);
//               expect(resBlogPost.title).to.equal(blogPost.title);
//               expect(resBlogPost.author).to.equal(blogPost.authorName);
//               expect(resBlogPost.content).to.equal(blogPost.content);
//             });
//       });
//   })

//   describe("test POST endpoint", function() {
//       it('should add a new blog post', function() {
//         const newBlogPost = generateBlogPostData();
  
//         return chai.request(app)
//           .post('/posts')
//           .send(newBlogPost)
//           .then(function(res) {
//             expect(res).to.have.status(201);
//             expect(res).to.be.json;
//             expect(res.body).to.be.a('object');
//             expect(res.body).to.include.keys(
//               'id', 'title', 'author', 'content', 'created');
//             expect(res.body.title).to.equal(newBlogPost.title);
//             expect(res.body.id).to.not.be.null;
//             expect(res.body.author).to.equal(`${newBlogPost.author.firstName} ${newBlogPost.author.lastName}`);
//             expect(res.body.content).to.equal(newBlogPost.content);
//             return BlogPost.findById(res.body.id);
//           })
//           .then(function(blogPost) {
//             expect(blogPost.title).to.equal(newBlogPost.title);
//             expect(blogPost.author.firstName).to.equal(newBlogPost.author.firstName);
//             expect(blogPost.author.lastName).to.equal(newBlogPost.author.lastName);
//             expect(blogPost.content).to.equal(newBlogPost.content);
//           });
//       });
//   })

//   describe("test PUT endpoint", function() {
//       it('should update fields you send over', function() {
//           const updateData = {
//             title: 'updated title',
//             author: 'Will Shaughnessy'
//           };
    
//           return BlogPost
//             .findOne()
//             .then(function(blogPost) {
//               updateData.id = blogPost.id;
//               return chai.request(app)
//                 .put(`/posts/${blogPost.id}`)
//                 .send(updateData);
//             })
//             .then(function(res) {
//               expect(res).to.have.status(204);
    
//               return BlogPost.findById(updateData.id);
//             })
//             .then(function(blogPost) {
//               expect(blogPost.name).to.equal(updateData.name);
//               expect(blogPost.cuisine).to.equal(updateData.cuisine);
//             });
//       });
//   })

//   describe("test DELETE endpoint", function() {
//       it('delete a restaurant by id', function() {

//           let blogPost;
    
//           return BlogPost
//             .findOne()
//             .then(function(_blogPost) {
//               blogPost = _blogPost;
//               return chai.request(app).delete(`/posts/${blogPost.id}`);
//             })
//             .then(function(res) {
//               expect(res).to.have.status(204);
//               return BlogPost.findById(blogPost.id);
//             })
//             .then(function(_blogPost) {
//               expect(_blogPost).to.be.null;
//             });
//         });
//   })
// });