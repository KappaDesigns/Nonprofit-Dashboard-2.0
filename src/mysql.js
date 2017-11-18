//@flow
require('dotenv').config();

const Sequelize = require('sequelize');
const Logger = require('../config/createLogger');

const logger = Logger('MYSQL', [
	'error',
]);

const sequelize = new Sequelize(
	'foo', 
	process.env.DB_USERNAME, 
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		dialect: 'mysql',

		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	}
);

sequelize
	.authenticate()
	.then(function handleConnection() {
		logger.info('Succesfully established a connection with database: foo');
	})
	.catch(function handleError(err) {
		logger.error(`Unable to connect to the database: ${err}`);
	});
	


logger.info('test');