import { Resource } from "./Resource";
import { ResourceType } from "./ResourceType";
import { Page } from "./Page";
import { Script } from "./Script";
import { Style } from "./Style";
import { readdir } from "fs";

export class Directory implements Resource<Array<Page | Directory | Script | Style>> {
	private type: ResourceType;
	private path: string;
	private name: string;

	constructor(path: string) {
		this.type = ResourceType.Directory;
		this.path = path;
		this.name = this.getDirectoryName();
	}

	private getDirectoryName(): string {
		let parts: Array<string> = this.path.split('/');
		let name = parts[parts.length - 1];
		return name;
	}

	public getResourceType(): ResourceType {
		return this.type;
	}

	public getResourcePath(): string {
		return this.path;
	}

	public getResourceName(): string {
		return this.name;
	}

	public async getContent(): Promise<Array<Page | Directory | Script | Style>> {
		return new Promise<Array<Page | Directory | Script | Style>>(async (resolve, reject) => {
			let resources : Array<Page | Directory | Script | Style> = [];
			let fileNames = await this.getFileNames();
			for (let i = 0; i < fileNames.length; i++) {
				let resource: Page | Directory | Script | Style = this.createResource(fileNames[i]);
				resources.push(resource);
			}
			return resolve(resources);
		});
	}

	private async getFileNames(): Promise<Array<string>> {
		return new Promise<Array<string>>((resolve, reject) => {
			readdir(this.path, 'utf8', (error: Error, files: Array<string>) => {
				if (error != null) {
					return reject(error);
				} else {
					return resolve(files);
				}
			});
		})
	}

	private createResource(fileName: string): Page | Directory | Script | Style {
		let nameParts: Array<string> = fileName.split('.');
		let extension: string = nameParts[nameParts.length - 1];
		switch (extension) {
			case 'html':
				return new Page(fileName);
			case 'css':
				return new Style();
			case 'js':
				return new Script();
			default:
				return new Directory(fileName);
		}
	}

	public async setContent(): Promise<void> {
		return null;
	}
}