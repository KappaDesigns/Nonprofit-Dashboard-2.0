import { config } from "dotenv";
import { Sequelize } from 'sequelize-typescript';
import { join } from "path";
config();

export class MySQLDataAccessObject {
	private sequelize: Sequelize;

	constructor() {
		this.sequelize = new Sequelize({
			host: process.env.DB_HOST,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			modelPaths: [join(__dirname, 'models')],
			database: process.env.DB_NAME,
			dialect: "mysql",
			operatorsAliases: Sequelize.Op as any,
			logging: false
		});
	}

	public async authenticateConnection(): Promise<void> {
		try {
			await this.sequelize.authenticate();
		} catch (error) {
			throw error;
		}
	}
}


// module.exports = async function createMYSQLWrapper(database) {
	// const sequelize = new Sequelize(
	// 	database, 
	// 	process.env.DB_USERNAME, 
	// 	process.env.DB_PASSWORD,
	// 	{
	// 		host: process.env.DB_HOST,
	// 		dialect: 'mysql',
	// 		operatorsAliases: Sequelize.Op,
	// 		logging: true,
	// 		pool: {
	// 			max: 5,
	// 			min: 0,
	// 			acquire: 10000,
	// 			idle: 10000,
	// 		},
	// 	}
	// );

	// await sequelize.authenticate().then(function handleConnection() {
	// 	logger.info(`Succesfully established a connection with database: "${database}"`);
	// }).catch(function handleError(err) {
	// 	logger.error(`Unable to connect to the database.\nError: ${err}`);
	// });
	
	// sequelize.types = Sequelize;
	// return sequelize;
// };
