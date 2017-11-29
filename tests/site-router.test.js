const chai = require('chai');
const request = require('request-promise');
const fs = require('fs');
const path = require('path');
const expect = chai.expect;
const Site = require('../src/lib/site');

const data = fs.readFileSync(
	path.resolve(__dirname, '../site/', 'index.html'),
	'utf-8'
);

describe('Site Router Test Suite', function() {
	describe('Should test the GET of a file at api/site/:path', () => {
		it('Should return 404 ok at /api/site', async () => {
			try {
				await request({
					method: 'GET',
					uri: 'http://localhost:8080/api/site/',
					resolveWithFullResponse: true,
				});
				throw new Error('Should not successfully get');
			} catch(err) {
				expect(err.statusCode).to.equal(404);
			}
		});
		it('Should return 404 at /api/site/aweifjawiefjawio', async () => {
			try {
				await request({
					method: 'GET', 
					uri: 'http://localhost:8080/api/aweifjawiefjawio',
					resolveWithFullResponse: true,
				});
				throw new Error('Should not successfully get');
			} catch(err) {
				expect(err.statusCode).to.equal(404);
			}
		});
	
		it('Should return 404 at requested directory', async () => {
			try {
				await request({
					method: 'GET', 
					uri: 'http://localhost:8080/api/site/imgs',
					resolveWithFullResponse: true,
				});
				throw new Error('Should not successfully get');
			} catch(err) {
				expect(err.statusCode).to.equal(404);
			}
		});
	
		it('Should return 200 at /api/site/index.html', async () => {
			try {
				const res = await request({
					method: 'GET', 
					uri: 'http://localhost:8080/api/site/index.html',
					resolveWithFullResponse: true,
				});
				expect(res.statusCode).to.equal(200);
			} catch(err) {
				throw err;
			}
		});
	
		it('Should have the same data as index.html', async () => {
			try {
				const res = await request({
					method: 'GET', 
					uri: 'http://localhost:8080/api/site/index.html',
					resolveWithFullResponse: true,
				});
				expect(res.body).to.equal(data);
			}  catch(err) {
				throw err;
			}
		});
	});

	describe('Should test the PUT request at api/site/:path', () => {
		it('Should PUT a 200 at api/site/index.html', async () => {
			try {
				const res = await request({
					method: 'PUT', 
					uri: 'http://localhost:8080/api/site/index.html',
					resolveWithFullResponse: true,
				});
				expect(res.statusCode).to.equal(200);
			}  catch(err) {
				throw err;
			}
		});

		it('Should PUT a 404 at api/site/', async () => {
			try {
				await request({
					method: 'PUT', 
					uri: 'http://localhost:8080/api/site/',
					resolveWithFullResponse: true,
				});
				throw new Error('Should not PUT successfully');
			}  catch(err) {
				expect(err.statusCode).to.equal(404);
			}
		});

		it('Should PUT a 404 at api/site/imgs', async () => {
			try {
				await request({
					method: 'PUT', 
					uri: 'http://localhost:8080/api/site/imgs',
					resolveWithFullResponse: true,
				});
				throw new Error('Should not successfully PUT');
			} catch(err) {
				expect(err.statusCode).to.equal(404);
			}
		});

		it('Should write input.html data to test.html', () => {
		});
	});
});