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
const Crypto = require('crypto');

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
	const config = await util.readConfig();
	const repo = await openRepository();	

	// fetches most recent changes
	logger.info('Fetching...');
	try {
		await repo.fetch(config.git.remote);
	} catch (err) {
		logger.error(`Error fetching git.\nError:${err}`);
		return err;
	}

	// creates FETCH_HEAD ref for merge
	logger.info('Creating FETCH_HEAD ref');
	let headRef = await createHeadReference(repo);

	// merges local production branch with fetched changes
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
		await repo.mergeBranches(config.git.branch, headRef, signature, mergePref);
	} catch (err) {
		logger.error(`Error merging local git and development git \nError:${err}`);
		throw err;
	}
}

/**
 * @async
 * @description creates a reference to the head where the git was most recently fetched
 * @param {nodegit.Repository:Object} repo node git repository object.
 * @returns {nodegit.Reference:Object} returns a nodegit reference that
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
 * @returns {nodegit.Repository:Object} returns a nodegit repository 
 * after opening so that commands can be run on top of it
 * @async
 */
async function openRepository() {
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
			const repo = await openRepository();
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
 * @param {nodegit.Repository:Object} repo git repository
 * @param {nodegit.Oid:Object} oID Oid of commit prior
 * @param {nodegit.Commit:Object} parent parent commit
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

/**
 * @description publishes site to the configured 
 * publish remote and branch of the repo
 * @async
 */
async function push() {
	return new Promise(async function handlePromise(resolve, reject) {
		const config = await util.readConfig();
		const repo = await openRepository();
		try {
			logger.info(`getting specified remote ${config.git.remote}`);
			const remote = await repo.getRemote(config.git.remote);
			await remote.push(
				[`refs/heads/master:refs/heads/${config.git.branch}`],
				{
					callbacks: {
						credentials: async () => {
							const creds = await handleCreds(config);
							return Git.Cred.userpassPlaintextNew(
								creds[0], 
								creds[1],
							);
						},
					},
				}
			);
			logger.info('Pushed repo to github.');
			return resolve();
		} catch(err) {
			logger.error(`${err}`);
			return reject(err);
		}
	});
}

/**
 * @description handles github credentials when publishing to repo
 * @param {Object} config app configuration object
 * @async
 * @returns {Array.<String>} returns an array containing the username
 * and password of the bot
 */
async function handleCreds(config) {
	return new Promise(function handlePromise(resolve) {
		logger.info('handling git hub credentials...');
		const pass = config.git.password;
		const user = config.git.username;
		decrypt(config, user, function handleUsername(username) {
			decrypt(config, pass, function hanldePassword(password) {
				return resolve([username, password]);
			});
		});
	});
}

/**
 * 
 * @param {Object} config app configuration object
 * @param {String} str string to decrypt
 * @param {Function} next callback when finished decrypting
 * @returns {String} returns the decrypted string to the
 * callback
 * @async
 */
function decrypt(config, str, next) {
	logger.info('decrypting...');
	const decipher = Crypto.createDecipher('aes192', config.secret);
	let decrypted = '';

	decipher.on('readable', function handleRead() {
		const data = decipher.read();
		if (data) {
			decrypted += data.toString('utf8');
		}
	});

	decipher.on('end', function handleClose() {
		logger.info('finished decrypting...');
		return next(decrypted);
	});
	decipher.write(str, 'hex');
	decipher.end();
}

/**
 * @description reverts the git branch to the requested commit
 * @param {String} hash represents the hash of the commit
 * @async
 */
async function revert(hash) {
	return new Promise(async function handlePromise(resolve, reject) {
		try {
			const config = await util.readConfig();
			let repo = await openRepository(sitePath);
			logger.info('Setting new head...');
			let newHead = await repo.getCommit(hash);
			const TYPE = Git.Reset.TYPE.HARD;
			const opts = new Git.CheckoutOptions();
			logger.info('Reseting...');
			await Git.Reset.reset(
				repo, 
				newHead, 
				TYPE, 
				opts, 
				config.git.branch
			);
			return resolve();
		} catch(err) {
			logger.error(`${err}`);
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