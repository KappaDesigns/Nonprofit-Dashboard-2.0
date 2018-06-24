import { Repository } from "nodegit";
import { RepositoryCloner } from "./Git/RepositoryCloner";
import { MySQLDataAccessObject } from "../MySQL/MySQLDataAccess";

export class Site {
	private repository: Repository;
	private mysqlDAO: MySQLDataAccessObject;
	private repositoryURL: string;

	constructor(repositoryURL: string) {
		this.repositoryURL = repositoryURL;
		this.mysqlDAO = new MySQLDataAccessObject();
	}

	public async init(): Promise<void> {
		this.repository = await RepositoryCloner.cloneRepository(this.repositoryURL);
		this.mysqlDAO.authenticateConnection();
		await this.buildSite();
	}

	private async buildSite() {
		
	}
}