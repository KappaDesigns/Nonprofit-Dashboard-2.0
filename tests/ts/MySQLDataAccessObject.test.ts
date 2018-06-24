import { MySQLDataAccessObject } from "../../src/lib/MySQL/MySQLDataAccess";

describe('MySQL Data Access Object Test Suite', function () {
	it('Should authenticate a connection to the current database', async function() {
		let mysqlDAO = new MySQLDataAccessObject();
		try {
			await mysqlDAO.authenticateConnection();
		} catch (err) {
			throw err;
		}
	})
})