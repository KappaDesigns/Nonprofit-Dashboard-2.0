import { Directory } from "../../src/lib/Site/Resources/Directory";
import { resolve } from "path";
import { expect } from "chai";
import { ResourceType } from "../../src/lib/Site/Resources/ResourceType";
import { Page } from "../../src/lib/Site/Resources/Page";
import { Script } from "../../src/lib/Site/Resources/Script";
import { Style } from "../../src/lib/Site/Resources/Style";
import { ContentType } from "../../src/lib/Site/Resources/ContentType";

describe('Directory Test Suite', () => {
	it('Should get directory name', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir');
		let directory = new Directory(path);
		expect(directory.getResourceName()).to.equal('test_dir');
	});

	it('Should get directory path', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir');
		let directory = new Directory(path);
		expect(directory.getResourcePath()).to.equal(path);
	});

	it('Should get the resource type of the directory', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir');
		let directory = new Directory(path);
		expect(directory.getResourceType()).to.equal(ResourceType.Directory);
	});

	it('Should get contents of the directory', async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir');
		let directory = new Directory(path);
		let contents: Array<ContentType>  = await directory.getContent();
		for (let i = 0; i < contents.length; i++) {
			expect(contents[i].getResourceType()).to.equal(i);
		}
	});
});