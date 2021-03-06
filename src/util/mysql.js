/**
 * @description MYSQL wrapper module. Allows for the client to easily 
 * connect to a MYSQL database and create Schema or easily query the 
 * database. This class requires the {@link module:util/Logger|Logger}, 
 * {@link https://www.npmjs.com/package/sequelize|Sequelize}, and 
 * {@link https://www.npmjs.com/package/dotenv|Dotenv}
 * @author Evan Coulson <ivansonofcoul@gmail.com>
 * 
 * @module util/MYSQL
 * 
 * @requires module:util/Logger
 * @requires Sequelize
 * @requires Dotenv
 */

/**
 * @private
 * @description Logger instance
 * @see module:util/Logger
 */
const Logger = require('./Logger');

require('dotenv').config();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * @async
 * @description Creates a MYSQL Wrapper using the Sequelize library
 * @param {String} database A string that defines the name of the 
 * database to connect to within MYSQL.
 * @returns {Sequelize:Object} returns a Sequelize Object that has been connected 
 * to a database. See {@link https://www.npmjs.com/package/sequelize|Sequelize}
 * For how to use the authenticated Sequelized object. Also appends
 * Sequelize types to the object to create a short hand to reference
 * Sequelize Schema types.
 */
module.exports = async function createMYSQLWrapper(database) {
	const logger = Logger(`db:${database}`, ['error', 'debug']);	
	const sequelize = new Sequelize(
		database, 
		process.env.DB_USERNAME, 
		process.env.DB_PASSWORD,
		{
			host: process.env.DB_HOST,
			dialect: 'mysql',
			operatorsAliases: Op,
			logging: false,
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000,
			},
		}
	);

	// Wait for database connection...
	await sequelize.authenticate().then(function handleConnection() {
		logger.info(`Succesfully established a connection with database: "${database}"`);
	}).catch(function handleError(err) {
		logger.error(`Unable to connect to the database.\nError: ${err}`);
	});
	
	//Append Sequelize Schema types to wrapper.
	sequelize.types = Sequelize;
	return sequelize;
};
