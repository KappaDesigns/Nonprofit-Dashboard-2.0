//@flow
const { createLogger, format, transports, config, addColors, add, remove } = require('winston');
const { combine, colorize, timestamp, label, printf } = format;

const GLOBAL_LOG = new transports.File({ filename: 'logs/combined.log' });

const logFormat = printf(function handleFormat(info) {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logLevels = {
    levels: { 
        error: 0,
        warn: 1,
        info: 2,
        verbose: 3,
        debug: 4,
        silly: 5,
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        verbose: 'gray',
        debug: 'blue',
        silly: 'white',
    }
}


module.exports = function (tag: string, levels: Array<string>) {
    let fileArray = levels.map((x) => {
        let obj = {
            filename: '',
            level: x,
        }
        obj.filename = `logs/${x}_${tag.toLowerCase()}.log`;
        return new transports.File(obj);
    });
    fileArray.push(GLOBAL_LOG);
    let logger = createLogger({
        level: process.env.LOG_LEVEL,
        format: combine(
            label({ label: tag, }),
            timestamp(),
            logFormat
        ),
        transports: fileArray,
    });
    if (process.env.NODE_ENV !== 'production') {
        logger.add(new transports.Console({
            colorize: true,
            format: combine(
                colorize(),
                logFormat
            )
        }));
    }
    return logger;
}