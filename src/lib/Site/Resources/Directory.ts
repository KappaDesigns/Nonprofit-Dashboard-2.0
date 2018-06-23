import { Resource } from "./Resource";
import { ResourceType } from "./ResourceType";
import { Page } from "./Page";
import { Script } from "./Script";
import { Style } from "./Style";
import { readdir } from "fs";
import { join } from "path";
import { ContentType } from "./ContentType";
import { WSASERVICE_NOT_FOUND } from "constants";

export class Directory implements Resource<Array<ContentType>> {
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

	public async getContent(): Promise<Array<ContentType>> {
		return new Promise<Array<ContentType>>(async (resolve, reject) => {
			let resources : Array<ContentType> = [];
			let fileNames = await this.getFileNames();
			for (let i = 0; i < fileNames.length; i++) {
				let resource: ContentType = this.createResource(fileNames[i]);
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

	private createResource(fileName: string): ContentType {
		let nameParts: Array<string> = fileName.split('.');
		let extension: string = nameParts[nameParts.length - 1];
		let newPath: string = join(this.path, fileName);
		switch (extension) {
			case 'html':
				return new Page(newPath);
			case 'css':
				return new Style(newPath);
			case 'js':
				return new Script(newPath);
			default:
				return new Directory(newPath);
		}
	}
}