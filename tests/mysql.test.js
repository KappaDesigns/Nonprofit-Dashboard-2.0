const chai = require('chai');
const createDatabaseConnection = require('../src/util/mysql');
const Logger = require('../src/util/Logger');
const logger = Logger('mysql', [], true);
const expect = chai.expect;

let MYSQL;

before(async function() {
	MYSQL = await createDatabaseConnection('test');
	console.log();
});

describe('MYSQL Test Suite', function() {
	let Animal;

	it('Should Define A Schema', () => {
		Animal = MYSQL.define('animals', {
			species: {
				type: MYSQL.types.STRING,
			},
			sound: {
				type: MYSQL.types.STRING,
			},
		});
		logger.info('Successfully created Schema');
		expect(true).to.equal(true);
	});
	
	it('Should Create A Table', (done) => {
		Animal.sync({ force: true }).then(function () {
			logger.info('Table: "animals" successfully created');
			Animal.create({
				species: 'Lion',
				sound: 'rawr',
			});
			done();
		});
	});

	it('Should Find All Rows In The Table', (done) => {
		Animal.findAll().then(function handleAnimals(animals) {
			logger.debug(`Found all animals. Length of ${animals.length}`);
			for (let i = 0; i < animals.length; i++) {
				logger.debug(`row_${i}: ${JSON.stringify(animals[i].dataValues)}`);
				expect(animals[i].dataValues.species.toLowerCase()).to.equal('lion');
			}
			done();
		}).catch(function handleError(err) {
			logger.error(`Error finding all animals.\n\tError:${err}`);
			done(err);
		});
	});
});