require('./helpers/browser')();

const React = require('react');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { shallow, mount} = require('enzyme');
const { expect } = require('chai');

import Layout from '../src/app/src/components/Layout';
import Navbar from '../src/app/src/components/Layout/Navbar';
import Navlink from '../src/app/src/components/Layout/Navbar/NavLink';
import { StaticRouter } from 'react-router-dom';

const pages = [
	{
		path: '/test1',
		name: 'test1',
	},
	{
		path: '/test2',
		name: 'test2',
	},
	{
		path: '/test3',
		name: 'test3',
	},
];

const config = require('../config');

describe('<Navbar/>', function () {
	it ('Should have the proper tags in the component', () => {
		const wrapper = shallow(
			<Navbar site="test" pages={pages}/>
		);
		expect(wrapper.find('ul')).to.have.length(1);
	});

	it ('Should have the correct props', () => {
		const wrapper = shallow(
			<Layout />
		);
		expect(wrapper.find(Navbar).props().pages).to.have.length(config.navbar.length);
	});

	it('Should render three Navlinks', () => {
		
		const wrapper = mount(
			<StaticRouter>
				<Navbar site="test" pages={pages} />
			</StaticRouter>
		);
		expect(wrapper.find(Navlink)).to.have.length(3);
	});
});
