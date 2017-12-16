const Site = require('../src/lib/site');
const chai = require('chai');
const Logger = require('../src/util/Logger');
const logger = Logger('site_test', [], true);
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const util = require('../src/util');

const testURL = `https://api.github.com/repos/ecoulson/Kappa-Designs-Home/commits?access_token=${process.env.ACCESS_TOKEN}`;
const requestOptions = {
	uri: testURL,
	headers: {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'Request-Promise',		
	},
	json: true,
};
const testFilePath = 'test.html';
const revertFilePath = 'revert.html';
const revertHash = '0a37f37a6cf7054bfd35210bc0500288612ec2d8';

describe('Site Test Suite', function() {
	it('Should get the file at a path', async () => {
		const testData = await Site.getPage('test.html');
		const data = fs.readFileSync(
			util.globalizePath(revertFilePath),
			'utf-8'
		);
		expect(testData).to.equal(data);
	});

	it('Should sync the local site with git', async function() {
		this.timeout(5000);
		logger.info('Getting most recent commit from github...');
		const commits = await request(requestOptions);
		const commitSHA = commits[0].sha;
		const sha = await Site.sync({
			firstName: 'test',
			email: 'test@test.com',
		});
		logger.info('Finished pull request');

		logger.info('Comparing shas..');
		logger.debug(commitSHA);
		logger.debug(sha);
		expect(commitSHA).to.equal(sha);
	});

	it('Should stage edits to the git repo', function (done) {
		//read input test file
		fs.readFile('./site/input.html', 'utf-8', async function handleRead(err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			//edit
			logger.info('Editing...');
			await Site.editPage(data, path.resolve(__dirname, '../site', testFilePath), 'test');

			//get tree
			logger.info('Getting most recent entry at test path...');
			const head = await Site.getHeadCommit();
			const tree = await head.getTree();

			//look at entry at file name
			const entry = await tree.entryByName(testFilePath);
			if (entry.isBlob()) {
				//check data
				logger.info('opening blob');
				const blob = await entry.getBlob();
				const content = blob.toString();
				expect(content).to.equal(data);
				return done(null);
			} else {
				return done(new Error('Git entry data does not match inputed data'));
			}
		});
	});

	it('Should push changes to the github repo', async function () {
		this.timeout(10000);
		logger.info('Getting head commit');

		logger.info('Publishing site...');
		const sha = await Site.publish();

		logger.info('Checking for recent commit...');
		const commits = await request(requestOptions);
		const commitSHA = commits[0].sha;
		logger.debug(sha);
		logger.debug(commitSHA);
		expect(sha).to.equal(commitSHA);
	});

	it('Should revert back to a commit', async function() {
		this.timeout(10000);
		const sha = await Site.revert(revertHash);
		const head = await Site.getHeadCommit();
		const revertFile = fs.readFileSync(
			path.resolve(__dirname, '../site', revertFilePath),
			'utf-8'
		);
		const testFile = fs.readFileSync(
			path.resolve(__dirname, '../site', testFilePath),
			'utf-8'
		);
		expect(head.sha()).to.equal(sha);
		expect(testFile).to.equal(revertFile);
	});

	after(async function() {
		this.timeout(10000);
		logger.info('pushing reversion commit to normalize repo state');
		await Site.publish();
	});
});