import { Page } from '../../src/lib/Site/Resources/Page';
import { expect } from 'chai';
import { ResourceType } from '../../src/lib/Site/Resources/ResourceType';
import { resolve } from 'path';
import { readFileSync } from 'fs';

let testContent = readFileSync(resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'a.html'), 'utf-8');

describe('Page Test Suite', () => {
	it ('Should throw an error', () => {
		try {
			let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'b.css');
			new Page(path);
		} catch (error) {
			expect(error.name).to.equal("IllegalResourceFile");
		}
	});

	it ('Should throw an error', () => {
		try {
			let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'x');
			new Page(path);
		} catch (error) {
			expect(error.name).to.equal("IllegalResourceFile");
		}
	})

	it ('Should get the resource type of the page', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'a.html');
		let page: Page = new Page(path);
		expect(page.getResourceType()).to.equal(ResourceType.Page);
	});

	it ('Should get the name of the page', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'a.html');
		let page: Page = new Page(path);
		expect(page.getResourceName()).to.equal('a');
	});

	it ('Should get the path to the page file', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'a.html');
		let page: Page = new Page(path);
		expect(page.getResourcePath()).to.equal(path);
	});

	it ('Should read the contents of the resource', async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'a.html');
		let page: Page = new Page(path);
		let content: string = await page.getContent();
		expect(content).to.equal(testContent);
	});

	it ('Should write the contents of the resource', async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'a.html');
		let page: Page = new Page(path);
		await page.setContent(testContent + '<!-- comment -->');
		let content: string = await page.getContent();
		expect(content).to.equal(testContent + '<!-- comment -->');
	});

	after(async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_dir', 'a.html');
		let page: Page = new Page(path);
		await page.setContent(testContent);
	})
})