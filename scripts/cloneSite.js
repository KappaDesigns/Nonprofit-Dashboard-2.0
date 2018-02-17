//modules
const fs = require('fs');
const Logger = require('../src/util/Logger');
const Git = require('nodegit');
const path = require('path');

//initialize logger
const logger = Logger('clone_site', ['error']);

//main function of this script
(async function main() {
	//gets the property gitURL from the config object
	const { gitURL } = await readConfig();

	const localPath = path.resolve(__dirname, '../', 'site');
	logger.info(`Git URL: ${gitURL}`);

	const repository = clone(gitURL, localPath);
	logger.debug(repository);
})();

//reads config and returns a javascript object representing the config
function readConfig() {
	return new Promise(function promiseHandler(resolve, reject) {
		fs.readFile('./config.json', 'utf-8', function handleRead(err, data) {
			if (err) {
				logger.error(`Error reading config file\nError:${err}`);
				return reject(err);
			}
			logger.info(`Config: ${data}`);
			let json = JSON.parse(data);
			return resolve(json);
		});
	});
}

//clones git repo
async function clone(gitURL, localPath) {
	let repo;
	logger.info('Cloning...');
	try {
		repo = await Git.Clone(gitURL, localPath);
		logger.info(`Successfully cloned git repository ${gitURL} to ${localPath}`);
	} catch(err) {
		logger.error(`Error cloning repo.\nError: ${err}`);
	}
	return repo;
}