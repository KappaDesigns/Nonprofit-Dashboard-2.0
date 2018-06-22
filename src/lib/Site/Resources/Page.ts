import { Resource } from "./Resource";
import { ResourceType } from "./ResourceType";
import { Script } from "./Script";
import { Style } from "./Style";
import { readFile } from "fs";

export class Page implements Resource<string> {
	private type: ResourceType;
	private path: string;
	private name: string;
	private styles: Array<Style>;
	private scripts: Array<Script>;

	constructor(type: ResourceType, path: string) {
		this.type = type;
		this.path = path;
		this.name = this.getResourceNameFromPath();
		this.styles = [];
		this.scripts = [];
	}

	private getResourceNameFromPath(): string {
		let parts: Array<string> = this.path.split('/');
		let nameParts: Array<string> = parts[parts.length - 1].split('.');
		return nameParts[0];
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

	public setContent(content: string): void {
		return;
	}
}