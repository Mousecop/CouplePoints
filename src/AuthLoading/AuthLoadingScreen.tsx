import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';

export interface Props {
	navigation: any;
}

export class AuthLoading extends Component<Props> {
	constructor(props: Props) {
		super(props);
		this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		const userToken = await AsyncStorage.getItem('userToken');

		this.props.navigation.navigate(userToken ? 'App' : 'Auth');
	};

	render() {
		return (
			<View>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
			</View>
		);
	}
}
