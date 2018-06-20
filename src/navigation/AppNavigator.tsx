// import React, { Component } from 'react';
import { createStackNavigator, createSwitchNavigator } from 'react-navigation';
/* Route Component imports */
import { Signup } from '../components/Signup/signup';
import { Login } from '../components/Login/login';
import { Home } from '../components/Home/home';
import { AuthLoading } from '../AuthLoading/AuthLoadingScreen';
import { JoinGame } from '../components/JoinGame/joinGame';
import { NoGameFound } from '../components/shared/noGameFound';
import { CreateGame } from '../components/CreateGame/createGame';

const authStack = createStackNavigator({ Login: Login, Signup: Signup });
const appStack = createStackNavigator({
	Home: Home,
	initalScreen: NoGameFound,
	Join: JoinGame,
	Create: CreateGame
});

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
