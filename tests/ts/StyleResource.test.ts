import { Style } from '../../src/lib/Site/Resources/Style';
import { expect } from 'chai';
import { ResourceType } from '../../src/lib/Site/Resources/ResourceType';
import { resolve } from 'path';
import { readFileSync } from 'fs';

let testContent = readFileSync(resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b.css'), 'utf-8');

describe('Style Test Suite', () => {
	it ('Should throw an error', () => {
		try {
			let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'a.html');
			let style: Style = new Style(path);
		} catch (error) {
			expect(error.name).to.equal("IllegalResourceFile");
		}
	});

	it ('Should throw an error', () => {
		try {
			let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'a');
			let style: Style = new Style(path);
		} catch (error) {
			expect(error.name).to.equal("IllegalResourceFile");
		}
	})

	it ('Should get the resource type of the style', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b.css');
		let style: Style = new Style(path);
		expect(style.getResourceType()).to.equal(ResourceType.Style);
	});

	it ('Should get the name of the style', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b.css');
		let style: Style = new Style(path);
		expect(style.getResourceName()).to.equal('b');
	});

	it ('Should get the path to the style file', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b.css');
		let style: Style = new Style(path);
		expect(style.getResourcePath()).to.equal(path);
	});

	it ('Should read the contents of the resource', async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b.css');
		let style: Style = new Style(path);
		let content: string = await style.getContent();
		expect(content).to.equal(testContent);
	});

	it ('Should write the contents of the resource', async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b.css');
		let style: Style = new Style(path);
		await style.setContent(testContent + '// comment');
		let content: string = await style.getContent();
		expect(content).to.equal(testContent + '// comment');
	});

	after(async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b.css');
		let style: Style = new Style(path);
		await style.setContent(testContent);
	})
})