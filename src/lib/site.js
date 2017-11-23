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
const fs = require('fs');
const util = require('../util');
const Logger = require('../util/Logger');

const sitePath = path.resolve(__dirname, '../../site');
const logger = Logger('Site.js', ['error']);

/**
 * @description emulates a git pull to update the site
 * with any recent changes made by the development team
 * @param {User:Object} user takes in a user object.
 * @see module:lib/User
 * @async
 */
async function pullRepo(user) {
	logger.info('Pulling repository...');

	const repo = await openRepository(sitePath);	

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
	try {
		await repo.mergeBranches('master', headRef, signature, mergePref);
	} catch (err) {
		logger.error(`Error merging local git and development git \nError:${err}`);
		throw err;
	}
}

/**
 * @async
 * @description creates a reference to the head where the git was most recently fetched
 * @param {Repository:Object} repo node git repository object.
 * @returns {Reference:Object} returns a nodegit reference that
 * refers to the FETCH_HEAD
 */
async function createHeadReference(repo) {
	try {
		let ref = await Git.Reference.lookup(repo, 'FETCH_HEAD');
		return ref;
	} catch(err) {
		logger.error(err);
		throw err;
	}
}

/**
 * @description opens the local repository saved to the machine
 * @param {String} sitePath path to local site git repo
 * @returns {Repository:Object} returns a nodegit repository 
 * after opening so that commands can be run on top of it
 * @async
 */
async function openRepository(sitePath) {
	return new Promise(async function handlePromise(resolve) {
		logger.info('Opening...');
		let repo;
		try {
			repo = await Git.Repository.open(sitePath);
			return resolve(repo);
		} catch(err) {
			logger.error('Error opening local git repository. This should not happen.'
						+ `Is /site missing? Is /site/.git missing?\nError:${err}`);
			throw err;
		}
	});
}

/**
 * @description Saves the updated file from the web ui to the server git
 * file and adds and commits file to recent changes
 * @param {String} data the html to write and update
 * @param {String} filePath the path at which to update the file
 * @param {User:Object} user takes in a user object
 * @see module:lib/User
 * @async
 */
async function saveFile(data, filePath, user) {
	return new Promise(function handlePromise(resolve, reject) {
		fs.writeFile(filePath, data, 'utf-8', async function handleWrite(err) {
			if (err) {
				logger.error(`Error writing to file at ${filePath}\nError: ${err}`);
				throw err;
			}
			logger.info(`Successfully wrote to ${filePath}`);
			//read config

			// open local repo
			logger.info('Opening...');
			const repo = await openRepository(sitePath);
			const index = await repo.refreshIndex();
			
			//add to tree
			logger.info('Adding...');
			try {
				filePath = localizePath(filePath);
				logger.debug(filePath);
				await index.addByPath(filePath.trim());
				await index.write();
				const oID = await index.writeTree();
				const head = await Git.Reference.nameToId(repo, 'HEAD');
				const parent = await repo.getCommit(head);
				
				// commit to repo
				const id = await commit(repo, oID, parent, user);
				logger.info(`Commit id: ${id}`);
				resolve();
			} catch(err) {
				logger.error('Error: ' + err);
				return reject(err);
			}
		});
	});
}

/**
 * @description takes the global file path of a file within
 * the local site stored and resolves the string to pertain to the ./site
 * dir as the root of the path
 * @param {String} filePath path to file
 * @returns {String} returns localized string to the ./site root
 */
function localizePath(filePath) {
	let subpaths = filePath.split('/');
	for (let i = 0; i < subpaths.length; i++) {
		if (subpaths[i] == 'site') {
			subpaths.splice(0, i + 1);
			break;
		}
	}
	filePath = '';
	for (let i = 0; i < subpaths.length; i++) {
		if (i != 0) {
			filePath += '/' + subpaths[i];
		} else {
			filePath += subpaths[i];
		}
	}
	return filePath;
}

/**
 * @description commits recent edits and changes to the
 * local repository
 * @param {Repository:Object} repo git repository
 * @param {Oid:Object} oID Oid of commit prior
 * @param {Commit:Object} parent parent commit
 * @param {User:Object} user takes in a user object
 * @returns {Number} the new commit id number
 * @see module:lib/User 
 * @async
 */
async function commit(repo, oID, parent, user) {
	logger.info('Commiting...');
	const config = await util.readConfig();
	const date = new Date();

	const author = Git.Signature.create(
		user.firstName, 
		user.email, 
		date.getTime(), 
		date.getTimezoneOffset()
	);

	const committer = Git.Signature.create(
		config.git.firstName,
		config.git.email,
		date.getTime(),
		date.getTimezoneOffset()
	);

	return await repo.createCommit(
		'HEAD',
		author, 
		committer, 
		user.message, 
		oID, 
		[parent]
	);
}

function push() {

}


/**
 * @description reverts the git branch to the requested commit
 * @param {String} hash represents the hash of the commit
 * @async
 */
async function revert(hash) {
	return new Promise(async function handlePromise(resolve, reject) {
		try {
			logger.info('Reverting...');
			let repo = await openRepository(sitePath);
			let toRevert = await repo.getCommit(hash);
			//toRevert: Undefined
			logger.debug(toRevert);
			await Git.Revert.revert(repo, toRevert);
			return resolve();
		} catch(err) {
			logger.error(err);
			return reject(err);
		}
	});
}

module.exports = {
	editPage: saveFile,
	update: pullRepo,
	publish: push,
	revert: revert,
	saveChanges: commit,
};