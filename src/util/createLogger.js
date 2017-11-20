//@flow
const { createLogger, format, transports } = require('winston');
const { combine, colorize, timestamp, label, printf } = format;

const GLOBAL_DEFAULT_LOG = new transports.File({ filename: 'logs/combined.log' });

const logFormat = printf(function handleFormat(info) {
	return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

module.exports = function Logger(tag, levels, testingEnv) {
	let fileArray = levels.map((x) => {
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
		fileArray.push(new transports.File({ filename: `logs/test_logs/${tag.toLowerCase()}.test.log`}));
	} else {
		fileArray.push(GLOBAL_DEFAULT_LOG);
	}

	let logger = createLogger({
		level: process.env.LOG_LEVEL,
		format: combine(
			label({ label: tag }),
			timestamp(),
			logFormat
		),
		transports: fileArray,
	});
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