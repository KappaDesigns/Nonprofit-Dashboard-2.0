import { Clone, CloneOptions, Repository } from "nodegit";
import { join } from "path";
import { remove } from "fs-extra";

export class RepositoryCloner {
	private static options: CloneOptions = new CloneOptions();
	private static localPath: string = join(__dirname, '..', '..', '..', '..', 'site');

	public static async cloneRepository(url: string): Promise<Repository> {
		Clone.initOptions(this.options, 1);
		let repository: Repository = await Clone.clone(url, this.localPath, this.options);
		return repository;
	}

	public static async forceCloneRepository(url: string): Promise<Repository> {
		remove(this.localPath);
		Clone.initOptions(this.options, 1);
		let repository: Repository = await Clone.clone(url, this.localPath, this.options);
		return repository;
	}
}