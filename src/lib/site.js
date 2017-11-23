/**
 * @description implementation of the how the site is edited via
 * the front end editor. Also handles publication of the site
 * commits and changes to the site, and updates the git hub repo
 * of the actaul site so that developers can see the change made
 * by those who are not developers. Built using 
 * {@link https://www.npmjs.com/package/nodegit|NodeGit}
 * 
 * @module lib/Site
 * 
 * 
 * @requires NodeGit
 * @requires module:util/Logger
 */

/**
 * NodeGit
 */
const Git = require('nodegit');
const path = require('path');

const Logger = require('../util/Logger');

const sitePath = path.resolve(__dirname, '../../site');
const logger = Logger('Site.js', ['error']);

/**
 * @description emulates a git pull to update the site
 * with any recent changes made by the development team
 * @param {User:Object} user takes in a user object.
 * @see module:lib/User
 */
async function pullRepo(user) {
	logger.info('Pulling repository...');

	// opens repository through file system
	logger.info('Opening...');
	let repo;
	try {
		repo = await Git.Repository.open(sitePath);
	} catch(err) {
		logger.error('Error opening local git repository. This should not happen.'
					+ `Is /site missing? Is /site/.git missing?\nError:${err}`);
		throw err;
	}

	// fetches most recent changes
	logger.info('Fetching...');
	try {
		await repo.fetch('origin');
	} catch (err) {
		logger.error(`Error fetching git.\nError:${err}`);
		return err;
	}

	// creates FETCH_HEAD ref for merge
	logger.info('Creating FETCH_HEAD ref');
	let headRef = await createHeadReference(repo);

	// merges local master with fetched changes
	logger.info('Merging..');
	const date = new Date();
	const signature = Git.Signature.create(
		user.firstName, 
		user.email, 
		date.getTime(), 
		date.getTimezoneOffset()
	);
	const mergePref = Git.Merge.PREFERENCE.NONE;
	logger.debug('master');
	logger.debug(headRef);
	logger.debug(signature);
	logger.debug(mergePref);
	try {
		await repo.mergeBranches('master', headRef, signature, mergePref);
	} catch (err) {
		logger.error(`Error merging local git and development git \nError:${err}`);
		throw err;
	}
}

async function createHeadReference(repo) {
	try {
		let ref = await Git.Reference.lookup(repo, 'FETCH_HEAD');
		return ref;
	} catch(err) {
		logger.error(err);
		throw err;
	}
}

function updateFile() {

}

module.exports = {
	editPage: updateFile,
	update: pullRepo,
	// publish: publish,
	// revert: revert,
	// saveChanges: commit,
};