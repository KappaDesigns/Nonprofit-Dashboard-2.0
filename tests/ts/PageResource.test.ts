import { Page } from '../../src/lib/Site/Resources/Page';
import { expect } from 'chai';
import { ResourceType } from '../../src/lib/Site/Resources/ResourceType';
import { resolve } from 'path';
import { readFileSync } from 'fs';

let testContent = readFileSync(resolve(__dirname, '..', 'helpers', 'test_files', 'test_1.html'), 'utf-8');

describe('Page Test Suite', () => {
	it ('Should throw an error', () => {
		try {
			let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_1.css');
			let page: Page = new Page(ResourceType.Page, path);
		} catch (error) {
			expect(error.name).to.equal("IllegalResourceFile");
		}
	});

	it ('Should throw an error', () => {
		try {
			let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_1');
			let page: Page = new Page(ResourceType.Page, path);
		} catch (error) {
			expect(error.name).to.equal("IllegalResourceFile");
		}
	})

	it ('Should get the resource type of the page', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_1.html');
		let page: Page = new Page(ResourceType.Page, path);
		expect(page.getResourceType()).to.equal(ResourceType.Page);
	});

	it ('Should get the name of the page', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_1.html');
		let page: Page = new Page(ResourceType.Page, path);
		expect(page.getResourceName()).to.equal('test_1');
	});

	it ('Should get the path to the page file', () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_1.html');
		let page: Page = new Page(ResourceType.Page, path);
		expect(page.getResourcePath()).to.equal(path);
	});

	it ('Should read the contents of the resource', async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_1.html');
		let page: Page = new Page(ResourceType.Page, path);
		let content: string = await page.getContent();
		expect(content).to.equal(testContent);
	});

	it ('Should write the contents of the resource', async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_1.html');
		let page: Page = new Page(ResourceType.Page, path);
		await page.setContent(testContent + '<!-- comment -->');
		let content: string = await page.getContent();
		expect(content).to.equal(testContent + '<!-- comment -->');
	});

	after(async () => {
		let path: string = resolve(__dirname, '..', 'helpers', 'test_files', 'test_1.html');
		let page: Page = new Page(ResourceType.Page, path);
		await page.setContent(testContent);
	})
})