import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

/* Route Component imports */
import { Signup } from '../components/Signup/signup';
import { Login } from '../components/Login/login';
const RootStack = createStackNavigator(
	{
		Signup: Signup,
		Login: Login
	},
	{
		initialRouteName: 'Login'
	}
);
export default class AppNavigator extends Component {
	render() {
		return <RootStack />;
	}
}
