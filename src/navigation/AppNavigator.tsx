// import React, { Component } from 'react';
import {
	createStackNavigator,
	createSwitchNavigator,
	createBottomTabNavigator
} from 'react-navigation';
/* Route Component imports */
import { Signup } from '../components/Signup/signup';
import { Login } from '../components/Login/login';
import { Home } from '../components/Home/home';
import { AuthLoading } from '../AuthLoading/AuthLoadingScreen';
import { JoinGame } from '../components/JoinGame/joinGame';
import { NoGameFound } from '../components/shared/noGameFound';
import { CreateGame } from '../components/CreateGame/createGame';
import { HomeLoading } from '../AuthLoading/HomeLoadingScreen';

const authStack = createStackNavigator({ Login: Login, Signup: Signup });
const homeStack = createStackNavigator({
	Home: Home
});
const noGameFoundStack = createStackNavigator({
	noGameFound: NoGameFound,
	Join: JoinGame,
	Create: CreateGame
});

const appTab = createBottomTabNavigator({
	Home: homeStack
});

export default createSwitchNavigator(
	{
		AuthLoadingScreen: AuthLoading,
		App: HomeLoading,
		Home: appTab,
		Auth: authStack,
		NoGameFound: noGameFoundStack
	},
	{
		initialRouteName: 'AuthLoadingScreen'
	}
);
