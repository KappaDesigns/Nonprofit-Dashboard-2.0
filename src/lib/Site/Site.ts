import { Repository } from "nodegit";
import { RepositoryCloner } from "./Git/RepositoryCloner";

export class Site {
	private repository: Repository;
	private repositoryURL: string;

	constructor(repositoryURL: string) {
		this.repositoryURL = repositoryURL;
	}

	public async init(): Promise<void> {
		this.repository = await RepositoryCloner.cloneRepository(this.repositoryURL);
		await this.buildSite();
	}

	private async buildSite() {

	}
}