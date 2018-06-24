import { Site } from "../../src/lib/Site/Site";
import { removeSync } from "fs-extra";
import { resolve } from "path";

const cloneURL = 'https://github.com/ecoulson/Kappa-Designs-Home.git'
describe('Site Test Suite', function () {
	it('It should init the site', async function() {
		this.slow(10000);
		this.timeout(20000);
		let outputPath = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir');
		await Site.init(cloneURL, outputPath);
	});
	
	after(function() {
		removeSync('./site');
	})
})