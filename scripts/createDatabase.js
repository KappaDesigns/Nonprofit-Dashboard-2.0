// node script that will create a database named after a given command line argument
// database will be updated via a mysql connection

//load env vars
require('dotenv').config();

const mysql = require('mysql2');

const Logger = require('./Logger');

const logger = Logger('db_creator', ['error','debug']);

//exits if there is no argument defining the database name
if (!process.argv[2]) {
	logger.error('Script received no argument defining database name in command line arguments. Please add a database name to command line arguments.');
	process.exit(1);
} else {
	createDatabase(process.env.DB_HOST, process.env.DB_USERNAME, process.env.DB_PASSWORD, process.argv[2]);
}

//creates the database with given host, username, password, and database name
async function createDatabase(host, user, pass, db) {
	//establish connection
	const connection = await mysql.createConnection({
		host: host,
		user: user,
		password: pass,
	});

	logger.info('Connection to MYSQL successfully established');

	//execute create database query
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

