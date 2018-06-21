require('./helpers/browser')();

const React = require('react');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { shallow } = require('enzyme');
const { expect } = require('chai');

import Navbar from '../src/app/src/components/Layout/Navbar';
import Navlink from '../src/app/src/components/Layout/Navbar/NavLink';

const pages = [
	{
		path: '/test1',
		name: 'test1',
	},
];

describe('<Navlink/>', function () {
	it ('Should have the correct props on the component', () => {
		const wrapper = shallow(
			<Navbar pages={pages}/>
		);
		expect(wrapper.find(Navlink).props().page).to.deep.equal(pages[0]);
	});

	it ('Should have the correct tags in the component', () => {
		const wrapper = shallow(
			<Navlink page={pages[0]} />
		);
		expect(wrapper.find('li')).to.have.length(1);
	});
});
