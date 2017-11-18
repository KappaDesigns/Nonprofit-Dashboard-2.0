const chai = require('chai');
const expect = chai.expect;

describe('A test suite', function() {
	beforeEach(function() { });
	afterEach(function() { });
	it('should fail', function() { expect(true).to.be.false; });
});