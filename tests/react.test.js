require('./helpers/browser')('<html><body></body></html>');
const React = require('react');
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const { shallow } = require('enzyme');
const { expect } = require('chai');

import Dashboard from '../src/app/src/pages/Dashboard';

describe('<Dashboard/>', function () {
	it ('should have an h1', () => {
		const wrapper = shallow(<Dashboard/>);
		expect(wrapper.find('h1')).to.have.length(1);
	});

	it ('should have text "Hello, World!"', function () {
		const wrapper = shallow(<Dashboard/>);
		expect(wrapper.find('h1').text()).to.equal('Hello, World!');
	});

	it ('should have a class test', function () {
		const wrapper = shallow(<Dashboard/>);
		expect(wrapper.find('h1').hasClass('test')).to.equal(true);
	});
});
