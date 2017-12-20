require('./helpers/browser')();

const React = require('react');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { shallow, mount } = require('enzyme');
const { expect } = require('chai');

import Layout from '../src/app/src/components/Layout';
import { StaticRouter } from 'react-router-dom';

describe('<Layout/>', function () {
	it ('Should have the correct props', () => {
		const wrapper = shallow(
			<StaticRouter>
				<Layout>
					<h1>Child to render</h1>
				</Layout>
			</StaticRouter>
		);
		expect(wrapper.find(Layout).props()).to.have.property('children');
	});

	it ('Should have the proper tags in the component', () => {
		const wrapper = mount(
			<StaticRouter>
				<Layout>
					<h1>Layout Test</h1>
				</Layout>
			</StaticRouter>
		);
		expect(wrapper.find('h1')).to.have.length(1);
		expect(wrapper.find('ul')).to.have.lengthOf.at.least(1);
	});
});
