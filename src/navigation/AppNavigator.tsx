import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

/* Route Component imports */
import { Signup } from '../components/Signup/signup';

const RootStack = createStackNavigator({
	Signup: Signup
});
export default class AppNavigator extends Component {
	render() {
		return <RootStack />;
	}
}
