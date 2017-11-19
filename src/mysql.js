//@flow
require('dotenv').config();

const Sequelize = require('sequelize');
const Logger = require('./util/createLogger');

const logger = Logger('MYSQL', ['error', 'debug']);

const sequelize = new Sequelize(
	'foo', 
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

sequelize.authenticate().then(function handleConnection() {
	logger.info('Succesfully established a connection with database: "foo"');
}).catch(function handleError(err) {
	logger.error(`Unable to connect to the database: ${err}`);
});

const Animal = sequelize.define('animals', {
	species: {
		type: Sequelize.STRING,
	},
	sound: {
		type: Sequelize.STRING,
	},
});

Animal.sync({force: true}).then(() => {
	logger.info('Table: "animals" succesfully created');
	return Animal.create({
		species: 'Lion',
		sound: 'RAWR',
	});
}).then(function () {
	Animal.findAll().then(function handleAnimals(animals) {
		logger.debug(animals);
	}).catch(function handleError(err) {
		logger.error(err);
	});
});
