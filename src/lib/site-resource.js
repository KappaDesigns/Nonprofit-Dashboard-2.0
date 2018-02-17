const fs = require('fs');
const Site = require('../lib/site');
const Logger = require('../util/Logger');
const util = require('../util');

/**
 * @module lib/SiteResource
 * @description Interface for accessing files within
 * the site that is being managed through the file system.
 */

const logger = Logger('site_test', ['debug', 'error']);

/**
 * @async
 * @description Gets the data pertaining to a file within the hosted site
 * which is being edited by the admin panel.
 * @param {String} path local path to the file within the hosted site
 * @param {FileHandler} handler callback function for the function
 * 
 */
function getFileData(path, handler) {
	path = util.globalizePath(path);
	fs.stat(path, async function handleAccess(err, stats) {
		if (err) {
			logger.info('Error finding file...');
			if (err.code === 'ENOENT') {
				logger.info('File not found...');
				return handler(err);
			} else {
				logger.info('Failure accessing file...');
				return handler(err);
			}
		} else if (!stats.isFile()) {
			logger.info('Not a file...');
			return handler(new Error('Requested Resource Not a File'));
		} else {
			const data = await Site.getPage(path);
			return handler(null, {
				path: util.localizePath(path),
				fileData: data, 
				fileStatus: stats,
			});
		}
	});
}
/**
 * @callback FileHandler
 * @param {Object} err any error that occured while reading the file data
 * @param {Object} data data pertaining to the file requested
 */

module.exports = {
	getFileData: getFileData,
};