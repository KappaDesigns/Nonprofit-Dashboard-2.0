require('dotenv').config();
const MYSQL = require('mysql');
const { createLogger, format, transports, config, addColors, add, remove } = require('winston');
const { combine, colorize, timestamp, label, printf } = format;

// TODO: Refactor into config file. /////////
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

const logger = createLogger({
    level: process.env.LOG_LEVEL,
    format: combine(
        label({ label: 'MYSQL', }),
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error'}),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
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
////////////////////////////

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