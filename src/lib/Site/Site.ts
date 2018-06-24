import { Repository } from "nodegit";
import { RepositoryCloner } from "./Git/RepositoryCloner";
import { MySQLDataAccessObject } from "../MySQL/MySQLDataAccess";
import { join } from "path";
import { ContentType } from "./Resources/ContentType";
import { Directory } from "./Resources/Directory";
import { ResourceType } from "./Resources/ResourceType";

export class Site {
	private static repository: Repository;
	private static mysqlDAO: MySQLDataAccessObject;
	private static contentMapping: { [path: string]: ContentType }

	public static async init(repositoryURL: string, outputPath?: string): Promise<void> {
		this.repository = await RepositoryCloner.cloneRepository(repositoryURL);
		this.mysqlDAO = new MySQLDataAccessObject();
		this.mysqlDAO.authenticateConnection();
		let path = join(this.repository.path(), '..');
		if (outputPath != undefined) {
			path = outputPath;
		}
		this.contentMapping = await this.buildSite(path);
	}

	private static async buildSite(root: string): Promise<{ [path: string]: ContentType }> {
		return await this.buildSiteHelper(root, root);
	}

	private static async buildSiteHelper(root: string, currentDirectory: string): Promise<{ [path: string]: ContentType }> {
		let directory = new Directory(currentDirectory);
		let contents: Array<ContentType> = await directory.getContent();
		let pathMapping : { [path: string]: ContentType } = {}; 
		for (let i = 0; i < contents.length; i++) {
			let path = this.removeRootFromPath(root, contents[i].getResourcePath());
			pathMapping[path] = contents[i];
			if (contents[i].getResourceType() == ResourceType.Directory) {
				let subPathMapping : { [path: string]: ContentType } = await this.buildSiteHelper(root, contents[i].getResourcePath());
				for (const subPath in subPathMapping) {
					pathMapping[subPath] = subPathMapping[subPath];
				}
			}
		}
		return pathMapping;
	}

	private static removeRootFromPath(root: string, path: string) {
		let rootRemoved: string = path.replace(root, '');
		return rootRemoved;
	}

	public static getMySQLDAO(): MySQLDataAccessObject {
		return this.mysqlDAO;
	}

	public static getContentMap(): { [path: string]: ContentType } {
		return this.contentMapping;
	}
}