/**
 * @description implementation of the how the site is edited via
 * the front end editor. Also handles publication of the site
 * commits and changes to the site, and updates the git hub repo
 * of the actaul site so that developers can see the change made
 * by those who are not developers. Built using 
 * {@link https://www.npmjs.com/package/nodegit|NodeGit}
 * @author Evan Coulson <ivansonofcoul@gmail.com>
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
const HtmlParser = require('./html-parser');

const sitePath = path.resolve(__dirname, '../../site');
const logger = Logger('Site.js', ['error']);

async function getFile(path) {
	return new Promise(function handlePromise(resolve, reject) {
		fs.readFile(util.globalizePath(path), 'utf-8', 
			function handleRead(err, data) {
				if (err) {
					logger.error(err);
					return reject(err);
				}
				return resolve(data);
			});
	});
}

/**
 * @description emulates a git pull to update the site
 * with any recent changes made by the development team
 * @param {User:Object} user takes in a user object.
 * @returns {String} returns the sha of the new head commit
 * @see module:lib/User
 * @async
 */
async function pullRepo(user) {
	return new Promise(async function handlePromise(resolve, reject) {
		logger.info('Pulling repository...');
		const config = await util.readConfig();
		const repo = await openRepository();	
	
		await fetch(repo, config, reject);
	
		// creates FETCH_HEAD ref for merge
		let headRef = await createHeadReference(repo);
	
		const signature = createSignature(user);

		logger.info('Merging..');
		const mergePref = Git.Merge.PREFERENCE.NONE;
		try {
			await repo.mergeBranches(config.git.branch, headRef, signature, mergePref);
			repo.stateCleanup();
			
			const index = await repo.refreshIndex();
			let newCommit = await getHeadCommit();
			if (index.hasConflicts()) {
				await resolveConflicts(head, repo, index, true);
				await index.addAll();
				await index.write();
				const oID = await index.writeTree();
				const head = await Git.Reference.nameToId(repo, 'HEAD');
				const headCommit = await repo.getCommit(head);
				newCommit = await commit(repo, oID, headCommit, 'Fixing pull issues');
			}
			return resolve(newCommit.sha());
		} catch (err) {
			logger.error(`Error merging local git and development git \nError:${err}`);
			return reject(err);
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
async function saveFile(data, filePath, message) {
	return new Promise(function handlePromise(resolve, reject) {
		fs.writeFile(filePath, data, 'utf-8', async function handleWrite(err) {
			if (err) {
				logger.error(`Error writing to file at ${filePath}\nError: ${err}`);
				throw err;
			}
			logger.info(`Successfully wrote to ${filePath}`);

			// open local repo
			logger.info('Opening...');
			const repo = await openRepository();
			const index = await repo.refreshIndex();
			
			//add to tree
			logger.info('Adding...');
			try {
				filePath = util.localizePath(filePath);
				logger.debug(filePath);
				await index.addByPath(filePath.trim());
				await index.write();
				const oID = await index.writeTree();
				const head = await Git.Reference.nameToId(repo, 'HEAD');
				const parent = await repo.getCommit(head);
				
				// commit to repo
				const newHead = await commit(repo, oID, parent, message);
				return resolve(newHead.sha());
			} catch(err) {
				logger.error('Error: ' + err);
				return reject(err);
			}
		});
	});
}

/**
 * @description publishes site to the configured 
 * publish remote and branch of the repo
 * @returns {String} returns the sha of the head commit
 * @async
 */
async function push() {
	return new Promise(async function handlePromise(resolve, reject) {
		const config = await util.readConfig();
		const repo = await openRepository();
		try {
			logger.info(`getting specified remote ${config.git.remote}`);
			const head = await getHeadCommit();
			const remote = await repo.getRemote(config.git.remote);
			const refSpec = [`refs/heads/master:refs/heads/${config.git.branch}`];
			const opts = pushOptions(config);
			await remote.push(refSpec, opts);
			logger.info('Pushed repo to github.');
			return resolve(head.sha());
		} catch(err) {
			logger.error(`${err}`);
			return reject(err);
		}
	});
}

/**
 * @description reverts the git branch to the requested commit
 * @param {String} hash represents the hash of the commit
 * @returns {Stirng} returns the sha of the reverted commit
 * @async
 */
async function revert(hash) {
	return new Promise(async function handlePromise(resolve, reject) {
		try {
			let repo = await openRepository(sitePath);

			logger.info('Setting new head...');
			let newHead = await repo.getCommit(hash);
			const opts = new Git.RevertOptions();

			logger.info('Reverting...');
			await Git.Revert.revert(
				repo,
				newHead,
				opts,
			);
			repo.stateCleanup();
			
			const index = await repo.refreshIndex();
			let newestCommit = await getHeadCommit();
			if (index.hasConflicts()) {
				await resolveConflicts(newHead, repo, index, false);
				await index.addAll();
				await index.write();
				const oID = await index.writeTree();
				const head = await Git.Reference.nameToId(repo, 'HEAD');
				const headCommit = await repo.getCommit(head);
				newestCommit = await commit(repo, oID, headCommit, `Reverting to commit ${hash}`);
			}
			
			return resolve(newestCommit.sha());
		} catch(err) {
			logger.error(`${err}`);
			return reject(err);
		}
	});
}

/**
 * @private
 * @async
 * @description Resolves all conflicts by overwritting with all the old file
 * data as the resolve conflicts is used during a reversion function.
 * @param {nodegit.Commit:Object} parent parent commit of 
 * which git is attempting to revert to
 * @param {nodegit.Repository:Object} repo working repository of configured site
 * @param {nodegit.Index:Object} index working index of current repository
 * @param {Boolean} useNewFile tells the resolve to overwrite conflicted file
 * with the new or old file in the patch
 */

async function resolveConflicts(commit, repo, index, useNewFile) {
	logger.info('Resolving...');
	const tree = await commit.getTree();
	const opts = new Git.DiffOptions();
	const diff = await Git.Diff.treeToIndex(repo, tree, index, opts);
	const patches = await diff.patches();
	const conflictedPatches = patches.filter(function handleFilter(patch) {
		if (patch.isConflicted()) {
			return patch;
		}
	});
	conflictedPatches.forEach(async function handlePatch(patch) {
		let filePath;
		if (useNewFile) {
			filePath = patch.newFile().path();
		} else {
			filePath = patch.oldFile().path();
		}
		const entry = await tree.entryByPath(filePath);
		entry.parent = commit;
		if (entry.isBlob()) {
			const data = (await entry.getBlob()).toString();
			const filePath = util.globalizePath(path.join(tree.path(), entry.name()));
			fs.writeFileSync(filePath, data, 'utf-8');
		}
	});
}

/**
 * @description opens the local repository saved to the machine
 * @param {String} sitePath path to local site git repo
 * @returns {nodegit.Repository:Object} returns a nodegit repository 
 * after opening so that commands can be run on top of it
 * @async
 * @private
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
 * @description commits recent edits and changes to the
 * local repository
 * @param {nodegit.Repository:Object} repo git repository
 * @param {nodegit.Oid:Object} oID Oid of commit prior
 * @param {nodegit.Commit:Object} parent parent commit
 * @param {String} message takes in a user's commit message
 * @returns {Number} the new commit id number
 * @async
 * @private
 */
async function commit(repo, oID, parent, message) {
	logger.info('Commiting...');
	const config = await util.readConfig();

	const author = createSignature(config.git);
	const committer = createSignature(config.git);

	const oid = await repo.createCommit(
		'HEAD',
		author, 
		committer, 
		message, 
		oID, 
		[parent]
	);

	return await repo.getCommit(oid);
}

/**
 * @private
 * @description fetches most recent commit from configured remote
 * @param {nodegit.Repository:Object} repo nodeg it repository object at the sitePath
 * @param {Object} config app configuration variable
 * @param {Function} reject reject callback for promise
 * @async
 */
async function fetch(repo, config, reject) {
	logger.info('Fetching...');
	try {
		await repo.fetch(config.git.remote);
	} catch (err) {
		logger.error(`Error fetching git.\nError:${err}`);
		return reject(err);
	}
}

/**
 * @private
 * @description creates a git singature
 * @param {Object} info user information
 * @returns {nodegit.Signature:Object} returns a nodegit Signature
 */
function createSignature(info) {
	logger.info('Creating signature...');
	return Git.Signature.now(
		info.firstName, 
		info.email, 
	);
}

/**
 * @private
 * @description creates push credentials and configures other options
 * @param {Object} config app configuration variable
 * @returns {Object} returns an object that configures credentials
 */
function pushOptions(config) {
	return {
		callbacks: {
			credentials: async () => {
				const creds = await handleCreds(config);
				return Git.Cred.userpassPlaintextNew(
					creds[0], 
					creds[1],
				);
			},
		},
	};
}

/**
 * @async
 * @description creates a reference to the head where the git was most recently fetched
 * @param {nodegit.Repository:Object} repo node git repository object.
 * @returns {nodegit.Reference:Object} returns a nodegit reference that
 * refers to the FETCH_HEAD
 * @private
 */
async function createHeadReference(repo) {
	logger.info('Creating FETCH_HEAD ref');
	try {
		let ref = await Git.Reference.lookup(repo, 'FETCH_HEAD');
		return ref;
	} catch(err) {
		logger.error(err);
		throw err;
	}
}

/**
 * @private
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
		util.decrypt(config, user, function handleUsername(username) {
			util.decrypt(config, pass, function hanldePassword(password) {
				return resolve([username, password]);
			});
		});
	});
}

/**
 * @description gets the head commit of the repository
 * @returns {nodegit.Commit:Object} returns a nodegit commit object
 * @async
 */
async function getHeadCommit() {
	return new Promise(async function handlePromise(resolve) {
		const repo = await openRepository();
		const commit = await repo.getHeadCommit();
		resolve(commit);
	});
}



module.exports = {
	getPage: getFile, 
	editPage: saveFile, 
	sync: pullRepo, 
	publish: push,
	revert: revert,
	getHeadCommit: getHeadCommit,
	parseHTML: HtmlParser,
};