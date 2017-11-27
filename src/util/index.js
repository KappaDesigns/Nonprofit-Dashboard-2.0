/**
 * @description Implements util functions for all modules in the library
 * @author Evan Coulson <ivansonofcoul@gmail.com>
 */

const fs = require('fs');
const path = require('path');
const Logger = require('../util/Logger');
const Crypto = require('crypto');

const logger = Logger('lib.js', ['error', 'debug']);

const configPath = path.resolve(__dirname, '../', '../', 'config.json');

/**
 * @description reads the config and returns a javascript object
 * @returns {Object} represents the config
 * @async
 */
function readConfig() {
	return new Promise(function handlePromise(resolve) {
		fs.readFile(configPath, 'utf-8', function handleRead(err, data) {
			if (err) {
				logger.error(`Error reading config.\nError: ${err}`);
				throw err;
			}
			logger.debug('Config read successfully ' + data);
			return resolve(JSON.parse(data));
		});
	});
}


/**
 * @description takes the global file path of a file within
 * the local site stored and resolves the string to pertain to the ./site
 * dir as the root of the path
 * @param {String} filePath path to file
 * @returns {String} returns localized string to the ./site root
 * @private
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
 * @description returns the global file path
 * @param {String} filePath takes in the local site file path
 * @returns {String} returns the global file path of a local path
 * @private
 */
function globalizePath(filePath) {
	return path.resolve(__dirname, '../../site', filePath);
}

/**
 * 
 * @param {Object} config app configuration object
 * @param {String} str string to decrypt
 * @param {Function} next callback when finished decrypting
 * @returns {String} returns the decrypted string to the
 * callback
 * @async
 * @private
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

module.exports = {
	readConfig: readConfig,
	decrypt: decrypt,
	globalizePath: globalizePath,
	localizePath: localizePath,
};