//@flow
require('dotenv').config();
const MYSQL = require('mysql2');
const Logger = require('../config/createLogger');
const logger = Logger('MYSQL', [
    'error'
]);

logger.info('test');