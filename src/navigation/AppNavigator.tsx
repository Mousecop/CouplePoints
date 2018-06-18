// import React, { Component } from 'react';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';

/* Route Component imports */
import { Signup } from '../components/Signup/signup';
import { Login } from '../components/Login/login';
import { Home } from '../components/Home/home';
import { AuthLoading } from '../AuthLoading/AuthLoadingScreen';

const authStack = createStackNavigator({ Login: Login, Signup: Signup });
const appStack = createStackNavigator({ Home: Home });

export default createSwitchNavigator(
	{
		AuthLoadingScreen: AuthLoading,
		App: appStack,
		Auth: authStack
	},
	{
		initialRouteName: 'AuthLoadingScreen'
	}
);
