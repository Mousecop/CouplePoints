import React from 'react';
import {
	createStackNavigator,
	createSwitchNavigator,
	createBottomTabNavigator
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
/* Route Component imports */
import { Signup } from '../components/Signup/signup';
import { Login } from '../components/Login/login';
import { Home } from '../components/Home/home';
import { AuthLoading } from '../AuthLoading/AuthLoadingScreen';
import { JoinGame } from '../components/JoinGame/joinGame';
import { NoGameFound } from '../components/shared/noGameFound';
import { CreateGame } from '../components/CreateGame/createGame';
import { HomeLoading } from '../AuthLoading/HomeLoadingScreen';
import { Rules } from '../components/shared/rules';
const authStack = createStackNavigator({ Login: Login, Signup: Signup });
const homeStack = createStackNavigator({
	Home: Home
});
const noGameFoundStack = createStackNavigator({
	noGameFound: NoGameFound,
	Join: JoinGame,
	Create: CreateGame
});

const rulesStack = createStackNavigator({
	Rules: Rules
});

const appTab = createBottomTabNavigator(
	{
		Home: homeStack,
		Rules: rulesStack
	},
	{
		navigationOptions: ({ navigation }) => ({
			tabBarIcon: ({ focused, tintColor }) => {
				const { routeName } = navigation.state;
				let iconName;
				if (routeName === 'Home') {
					iconName = `ios-home${focused ? '' : '-outline'}`;
				} else if (routeName === 'Rules') {
					iconName = `ios-list-box${focused ? '' : '-outline'}`;
				}

				return <Ionicons name={iconName} size={25} color={tintColor} />;
			}
		}),
		tabBarOptions: {
			activeTintColor: '#FF4E50',
			inactiveTintColor: 'gray'
		}
	}
);

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
