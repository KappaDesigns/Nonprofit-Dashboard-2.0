const Site = require('../src/lib/site');
const chai = require('chai');
const Logger = require('../src/util/Logger');
const logger = Logger('site_test', [], true);
const expect = chai.expect;
const fs = require('fs');
const path = require('path');
const request = require('request-promise');

const testURL = 'https://api.github.com/repos/ecoulson/Kappa-Designs-Home/commits?access_token=20b4978a58c92b0c5df5be173cdbc3b4e3713ed6';
const requestOptions = {
	uri: testURL,
	headers: {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'Request-Promise',		
	},
	json: true,
};
const testFilePath = 'test.html';
const revertHash = '1dc364ed48a28b1ca9744dcfefc45f1a19c1e8a7';

describe('Site Test Suite', function() {
	it('Should sync the local site with git', async () => {
		logger.info('Getting most recent commit from github...');
		const commits = await request(requestOptions);
		const commitSHA = commits[0].sha;
		const sha = await Site.update({
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
		expect(head.sha()).to.equal(sha);
	});

	after(async function() {
		this.timeout(10000);
		logger.info('pushing reversion commit to normalize repo state');
		await Site.publish();
	});
});