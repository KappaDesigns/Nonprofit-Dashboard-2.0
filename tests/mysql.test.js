const chai = require('chai');
const createDatabaseConnection = require('../src/util/mysql');
const expect = chai.expect;

describe('MYSQL Test Suite', async function() {
	const MYSQL = await createDatabaseConnection('test');

	// testing code
// const Animal = sequelize.define('animals', {
// 	species: {
// 		type: Sequelize.STRING,
// 	},
// 	sound: {
// 		type: Sequelize.STRING,
// 	},
// });

// Animal.sync({force: true}).then(() => {
// 	logger.info('Table: "animals" succesfully created');
// 	return Animal.create({
// 		species: 'Lion',
// 		sound: 'RAWR',
// 	});
// }).then(function () {
// 	Animal.findAll().then(function handleAnimals(animals) {
// 		logger.debug(animals);
// 	}).catch(function handleError(err) {
// 		logger.error(err);
// 	});
// });
});