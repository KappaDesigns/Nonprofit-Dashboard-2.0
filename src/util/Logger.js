/**
 * @description The logger module is built on top of the Winston logging module 
 * {@link https://www.npmjs.com/package/winston|Winston}.
 * This module allows for loggers with different tags and debuging levels to be created with ease.
 * @author Evan Coulson <ivansonofcoul@gmail.com>
 * 
 * @module util/Logger
 * 
 * @requires Winston
 */

/**
 * Winston
 */
const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, label, printf } = format;

// combined log of all no-testing env logs
const GLOBAL_DEFAULT_LOG = new transports.File({ filename: 'logs/combined.log' });

// how output will be displayed to all transports.
const logFormat = printf(function handleFormat(info) {
	return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

/**
 * @description Creates a new Logger using a given tag, debugging levels,
 * and environment. Allowing multiple loggers to be easily created through
 * out the application.
 * @param {String} tag String that defines the tag of the logger and
 * allows the logger to be easily identified
 * @param {Array.<String>} debugLevels array of strings that determines
 * what level of logs should be written as files to the logs directory
 * @param {Boolean} testingEnv determines if the current logger is 
 * running in a testing env or not
 * @returns {Logger:Object} Returns a logger that logs all given values to
 * each transport
 */
module.exports = function Logger(tag, debugLevels, testingEnv) {
	let fileArray = debugLevels.map((x) => {
		let obj = {
			filename: '',
			level: x,
		};
		if (testingEnv) {
			obj.filename = `logs/test_logs/${tag.toLowerCase()}_${x}.test.log`;
		} else {
			obj.filename = `logs/${tag.toLowerCase()}_${x}.log`;
		}
		return new transports.File(obj);
	});
	
	if (testingEnv) {
		// If testing will create a combined log for each individual test
		fileArray.push(new transports.File({ 
			filename: `logs/test_logs/${tag.toLowerCase()}.test.log`,
		}));
	} else {
		// if not testing will create a combined log for all 
		// loggers that are not testing
		fileArray.push(GLOBAL_DEFAULT_LOG);
	}

	//creates logger instance
	let logger = createLogger({
		level: process.env.LOG_LEVEL,
		format: combine(
			label({ label: tag }),
			timestamp(),
			logFormat
		),
		transports: fileArray,
	});

	/** 
	 * if the application is not running in production or a testing 
	 * environment do not add the console transport to the logger
	 */
	if (process.env.NODE_ENV !== 'production' && !testingEnv) {
		logger.add(new transports.Console({
			colorize: true,
			format: combine(
				colorize(),
				logFormat
			),
		}));
	}
	return logger;
};