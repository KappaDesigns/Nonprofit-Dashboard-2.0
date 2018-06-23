import { Script } from '../../src/lib/Site/Resources/Script';
import { expect } from 'chai';
import { ResourceType } from '../../src/lib/Site/Resources/ResourceType';
import { resolve } from 'path';
import { readFileSync } from 'fs';

let testContent = readFileSync(resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'c.js'), 'utf-8');

describe('Script Test Suite', () => {
	it ('Should throw an error', () => {
		try {
			let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b.css');
			let script: Script = new Script(path);
		} catch (error) {
			expect(error.name).to.equal("IllegalResourceFile");
		}
	});

	it ('Should throw an error', () => {
		try {
			let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b');
			let script: Script = new Script(path);
		} catch (error) {
			expect(error.name).to.equal("IllegalResourceFile");
		}
	})

	it ('Should get the resource type of the script', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'c.js');
		let script: Script = new Script(path);
		expect(script.getResourceType()).to.equal(ResourceType.Script);
	});

	it ('Should get the name of the script', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'c.js');
		let script: Script = new Script(path);
		expect(script.getResourceName()).to.equal('c');
	});

	it ('Should get the path to the script file', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'c.js');
		let script: Script = new Script(path);
		expect(script.getResourcePath()).to.equal(path);
	});

	it ('Should read the contents of the resource', async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'c.js');
		let script: Script = new Script(path);
		let content: string = await script.getContent();
		expect(content).to.equal(testContent);
	});

	it ('Should write the contents of the resource', async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'c.js');
		let script: Script = new Script(path);
		await script.setContent(testContent + '// comment');
		let content: string = await script.getContent();
		expect(content).to.equal(testContent + '// comment');
	});

	after(async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'c.js');
		let script: Script = new Script(path);
		await script.setContent(testContent);
	})
})