const chai = require('chai');
const createDatabaseConnection = require('../src/util/mysql');
const expect = chai.expect;

describe('MYSQL Test Suite', async function() {
	const MYSQL = await createDatabaseConnection('foo');
	
});