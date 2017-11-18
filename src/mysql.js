//@flow
require('dotenv').config();
const Logger = require('../config/createLogger');
const logger = Logger('MYSQL', [
	'error',
]);

logger.info('test');