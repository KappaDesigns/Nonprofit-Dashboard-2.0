import { ResourceType } from './ResourceType';

export interface Resource<T> {
	getResourceType(): ResourceType;
	getResourcePath(): string,
	getResourceName(): string,
	getContent(): Promise<T>,
}