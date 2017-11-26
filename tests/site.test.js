const Site = require('../src/lib/site');
const chai = require('chai');
const Logger = require('../src/util/Logger');
const logger = Logger('site_test', [], true);
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const request = require('request-promise');

const testURL = 'https://api.github.com/repos/ecoulson/Kappa-Designs-Home/commits';
const requestOptions = {
	uri: testURL,
	headers: {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'Request-Promise',		
	},
	json: true,
};
const testFilePath = 'test.html';
const revertHash = '606fb7f044b11ccabf343b8a80ab0c39cb0db2a7';

describe('Site Test Suite', function() {
	it('Should sync the local site with git', async () => {
		logger.info('Getting most recent commit from github...');
		const commits = await request(requestOptions);
		const commitSHA = commits[0].sha;
		await Site.update({
			firstName: 'test',
			email: 'test@test.com',
		});
		logger.info('Finished pull request');
		logger.info('Getting head to check...');
		const head = await Site.getHeadCommit();

		logger.info('Comparing shas..');
		logger.debug(commitSHA);
		logger.debug(head.sha());
		expect(commitSHA).to.equal(head.sha());
	});

	it('Should stage edits to the git repo', function (done) {
		fs.readFile('./site/input.html', 'utf-8', async function handleRead(err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			logger.info('Editing...');
			await Site.editPage(data, path.resolve(__dirname, '../site', testFilePath), 'test');

			logger.info('Getting most recent entry at test path...');
			const head = await Site.getHeadCommit();
			const tree = await head.getTree();
			const entry = await tree.entryByName(testFilePath);
			if (entry.isBlob()) {
				logger.info('opening blob');
				const blob = await entry.getBlob();
				const content = blob.toString();
				expect(content).to.equal(data);
			} else {
				return done(true);
			}
			return done(null, data);
		});
	});

	it('Should push changes to the github repo', async function () {
		this.timeout(10000);
		logger.info('Getting head commit');
		const head = await Site.getHeadCommit();

		logger.info('Publishing site...');
		await Site.publish();

		logger.info('Checking for recent commit...');
		const commits = await request(requestOptions);
		const commitSHA = commits[0].sha;
		logger.debug(head.sha());
		logger.debug(commitSHA);
		expect(head.sha()).to.equal(commitSHA);
	});

	it('Should revert back to a commit', async () => {
		await Site.revert(revertHash);
		const head = await Site.getHeadCommit();
		logger.debug(revertHash);
		logger.debug(head.sha());
		expect(revertHash).to.equal(head.sha());
	});
});