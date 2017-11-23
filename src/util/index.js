const fs = require('fs');
const path = require('path');
const Logger = require('../util/Logger');

const logger = Logger('lib.js', ['error', 'debug']);

const configPath = path.resolve(__dirname, '../', '../', 'config.json');

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

module.exports = {
	readConfig: readConfig,
};