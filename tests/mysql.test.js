//@flow

require('dotenv').config();
const MYSQL = require('mysql');

const logger = require('../config/createLogger')('MYSQL', [
    { level: 'error'},
]);

const Connection = MYSQL.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

Connection.connect(function handleConnection(err) {
    if (err) {
        // Error Connecting to MYSQL DB
        logger.error(`Error Connecting To MYSQL Database. [Message]: ${err.message}`);
        throw err;
    }
    logger.info(`Susccessfully Connected To Database.`)
});