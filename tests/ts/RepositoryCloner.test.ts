import { RepositoryCloner } from "../../src/lib/Site/Git/RepositoryCloner";
import { Repository } from "nodegit";
import { expect } from "chai";
import { removeSync } from "fs-extra";

const cloneURL = 'https://github.com/ecoulson/Kappa-Designs-Home.git'

describe('Repository Cloner Test Suite', function () {
	it ('Should clone a repository', async function() {
		this.slow(7500);
		this.timeout(15000);
		let repo : Repository = await RepositoryCloner.cloneRepository(cloneURL);
		expect(repo).to.not.equal(null);
	});

	after(() => {
		removeSync('./site');
	})
});