import { Resource } from "./Resource";
import { ResourceType } from "./ResourceType";
import { readFile, writeFile } from "fs";
import { IllegalResourceFile } from "./IllegalResourceFile";

export class Style implements Resource<string> {
	private type: ResourceType;
	private path: string;
	private name: string;

	constructor(path: string) {
		this.type = ResourceType.Style;
		this.path = path;
		this.name = this.getResourceNameFromPath();
	}

	private getResourceNameFromPath(): string {
		let parts: Array<string> = this.path.split('/');
		let nameParts: Array<string> = parts[parts.length - 1].split('.');
		if (nameParts.length == 1) {
			throw new IllegalResourceFile(`Illegal resource file of type "directory" is not type of "css"`);
		} else if (nameParts.length >= 2 && nameParts[nameParts.length - 1] != 'css') {
			throw new IllegalResourceFile(`Illegal resource file of type "${nameParts[1]}" when it should be "css"`);
		} else {
			let name: string = "";
			for (let i = 0; i < nameParts.length - 1; i++) {
				name += nameParts[i];
				if (i < nameParts.length - 2) {
					name += "."
				}
			}
			return name;
		}
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

	public async getContent(): Promise<string> {
		return await this.readPage();
	}

	private async readPage(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			readFile(this.path, 'utf-8', (error: Error, content: string) => {
				if (error != null) {
					return reject(error);
				} else {
					return resolve(content);
				}
			})
		})
	}

	public async setContent(content: string): Promise<void> {
		return await this.writePage(content);
	}

	private async writePage(content: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			writeFile(this.path, content, 'utf-8', (error: Error) => {
				if (error != null) {
					return reject(error);
				} else {
					resolve();
				}
			})
		})
	}
}