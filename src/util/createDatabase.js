require('dotenv').config();
const mysql = require('mysql2');
const Logger = require('./createLogger');
const logger = Logger('db_creator', ['error','debug']);

if (!process.argv[2]) {
	logger.error('Script received no argument defining database name in command line arguments. Please add a database name to command line arguments.');
	process.exit(1);
} else {
	createDatabase(process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.argv[2]);
}

async function createDatabase(host, user, pass, db) {
	const connection = await mysql.createConnection({
		host: host,
		user: user,
		password: pass,
	});
	logger.info('Connection to MYSQL successfully established');

	connection.execute(
		`CREATE DATABASE ${db}`,
		function handleQueryRes(err) {
			if (err) {
				logger.error(`Error creating database ${db}.\n\t${err}`);
				process.exit(1);
			}
			logger.info(`Database: ${db} successfully created`);
			process.exit(0);
		}
	);
}

