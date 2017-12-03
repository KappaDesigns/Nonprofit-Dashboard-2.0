const chai = require('chai');
const request = require('request-promise');
const expect = chai.expect;
const Site = require('../src/lib/site');
const path = require('path');
const fs = require('fs');
const util = require('../src/util');
const Logger = require('../src/util/Logger');
const logger = Logger('site_router_test', [], true);

const input = fs.readFileSync(
	path.resolve(__dirname, '../site/input.html'),
	'utf-8'
);

describe('Site Router Test Suite', function() {
	describe('Should test the GET of a file at api/site/:path', () => {
		it('Should return 404 at /api/site', async () => {
			try {
				await request({
					method: 'GET',
					uri: 'http://localhost:8080/api/site/',
					resolveWithFullResponse: true,
				});
				
				const err = new Error('Should not successfully get');
				logger.error(err);
				throw err;
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
				
				const err = new Error('Should not successfully get');
				logger.error(err);
				throw err;
			} catch(err) {
				expect(err.statusCode).to.equal(404);
			}
		});
	
		it('Should return 400 at requested directory', async () => {
			try {
				await request({
					method: 'GET', 
					uri: 'http://localhost:8080/api/site/imgs',
					resolveWithFullResponse: true,
				});
				
				const err = new Error('Should not successfully get');
				logger.error(err);
				throw err;
			} catch(err) {
				expect(err.statusCode).to.equal(400);
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
				logger.error(err);
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
				const data = await Site.getPage('index.html');
				expect(res.body).to.equal(data);
			}  catch(err) {
				logger.error(err);
				throw err;
			}
		});
	});

	describe('Should test the PUT request at api/site/:path', () => {
		it('Should PUT a 400 at api/site/index.html', async () => {
			try {
				await request({
					method: 'PUT', 
					uri: 'http://localhost:8080/api/site/index.html',
					resolveWithFullResponse: true,
					form: {},
					json: true,
				});

				const err = new Error('Should not PUT successfully');
				logger.error(err);
				throw err;
			}  catch(err) {
				expect(err.statusCode).to.equal(400);
			}
		});

		it('Should PUT a 404 at api/site/', async () => {
			try {
				await request({
					method: 'PUT', 
					uri: 'http://localhost:8080/api/site/',
					resolveWithFullResponse: true,
					json: true,
					form: {},
				});

				const err = new Error('Should not PUT successfully');
				logger.error(err);
				throw err;
			}  catch(err) {
				expect(err.statusCode).to.equal(404);
			}
		});

		it('Should PUT a 400 at api/site/imgs', async () => {
			try {
				await request({
					method: 'PUT', 
					uri: 'http://localhost:8080/api/site/imgs',
					resolveWithFullResponse: true,
					json:true,
					form: {},
				});

				const err = new Error('Should not PUT successfully');
				logger.error(err);
				throw err;
			} catch(err) {
				expect(err.statusCode).to.equal(400);
			}
		});

		it('Should give a 400 if no body added to request', async () => {
			try {
				await request({
					method: 'PUT', 
					uri: 'http://localhost:8080/api/site/imgs',
					resolveWithFullResponse: true,
				});

				const err = new Error('Should not PUT successfully');
				logger.error(err);
				throw err;
			} catch (err) {
				expect(err.body).to.equal(undefined);
				expect(err.statusCode).to.equal(400);
			}
		});

		it('Should write input.html data to test.html', async () => {
			try {
				await request({
					method: 'PUT', 
					uri: 'http://localhost:8080/api/site/test.html',
					resolveWithFullResponse: true,
					json: true,
					form: {
						html: input,
						message: 'test',
					},
				});
				const data = await Site.getPage('test.html');
				expect(data).to.equal(input);
			} catch (err) {
				logger.error(err);
				throw err;
			}
		});
	});

	describe('Should test the update function of the site', async () => {
		it('Should POST a 200 at api/site/sync', async () => {
			try {
				const res = await request({
					method: 'POST',
					uri: 'http://localhost:8080/api/site/sync',
					resolveWithFullResponse: true,
					json: true,
				});
				expect(res.statusCode).to.equal(200);
			} catch (err) {
				logger.error(err);
				throw err;
			}
		});

		it('Should receive the correct SHA from api/site/sync', async () => {
			try {
				const res = await request({
					method: 'POST',
					uri: 'http://localhost:8080/api/site/sync',
					resolveWithFullResponse: true,
					json: true,
				});
				const head = await Site.getHeadCommit();
				expect(res.body).to.equal(head.sha());
			} catch (err) {
				logger.error(err);
				throw err;
			}
		});
	});

	after(async function () {
		this.timeout(10000);
		const revert = fs.readFileSync(
			util.globalizePath('revert.html'),
			'utf-8',
		);
		fs.writeFileSync(util.globalizePath('test.html'), revert);
		await Site.publish();
	});
});