const Site = require('../src/lib/site');
const chai = require('chai');
const Logger = require('../src/util/Logger');
const logger = Logger('site_test', [], true);
const expect = chai.expect;
const fs = require('fs');
const path = require('path');

describe('Site Test Suite', function() {
	it('Should sync the local site with git', async () => {
		logger.info('started pull request');
		await Site.update({
			firstName: 'test',
			email: 'test@test.com',
		});
		logger.info('finished pull request');
		expect(true).to.equal(true);
	});

	it('Should push edits to the git repo', (done) => {
		fs.readFile('./site/test2.html', 'utf-8', async function handleRead(err, data) {
			if (err) {
				logger.error(err);
				throw err;
			}
			await Site.editPage(data, path.resolve(__dirname, '../site', 'test.html'), {
				firstName: 'test',
				email: 'test@test.com',
				message: 'test',
			});
			done(null, data);
		});
	});

	it('Should revert back to a commit', async () => {
		await Site.revert('606fb7f044b11ccabf343b8a80ab0c39cb0db2a7');
		expect(true).to.equal(true);
	});
});