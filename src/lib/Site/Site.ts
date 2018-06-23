import { Repository } from "nodegit";
import { RepositoryCloner } from "./Git/RepositoryCloner";

export class Site {
	private repository: Repository;
	private repositoryURL: string;
	private hasInited: boolean;

	constructor(repositoryURL: string) {
		this.repositoryURL = repositoryURL;
		this.hasInited = false;
	}

	public async init(): Promise<void> {
		this.repository = await RepositoryCloner.cloneRepository(this.repositoryURL);
		await this.buildSite();
		this.hasInited = true;
	}

	private async buildSite() {

	}
}