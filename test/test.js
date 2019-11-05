// Import the dependencies for testing
var chai = require ('chai');
var chaiHttp = require ('chai-http');
var app = require('../app');

chai.use(chaiHttp);
chai.should();

describe("Bikes", () => {
  describe("GET /bikes", () => {
    // Test to get list of bikes 
     it("should return a list of bikes", (done) => {
       chai.request(app)
       .get('/bikes')
       .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        done();
       });
      });
    })
  })



// first working test with chai and mocha
// var assert = require('chai').assert;
// describe('Array', function() {
//   describe('#indexOf()', function() {
//     it('should return -1 when the value is not present', function() {
//       assert.equal([1, 2, 3].indexOf(4), -1);
//     });
//   });
// });