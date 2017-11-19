require('dotenv').config();
const Sequelize = require('sequelize');
const Logger = require('./createLogger');

module.exports = async function (database) {
	const logger = Logger(`sql:{${database}}`, ['error', 'debug']);	
	const sequelize = new Sequelize(
		database, 
		process.env.DB_USERNAME, 
		process.env.DB_PASSWORD,
		{
			host: process.env.DB_HOST,
			dialect: 'mysql',
			logging: false,
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		}
	);
	await sequelize.authenticate().then(function handleConnection() {
		logger.info('Succesfully established a connection with database: "foo"');
	}).catch(function handleError(err) {
		logger.error(`Unable to connect to the database: ${err}`);
	});
	return sequelize;
};