import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import * as firebase from 'firebase';

export interface Props {
	navigation: any;
}

export class HomeLoading extends Component<Props> {
	constructor(props: Props) {
		super(props);
		this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		const userToken = await AsyncStorage.getItem('userToken').then(
			result => result
		);

		console.log('userToken', userToken);

		if (userToken) {
			firebase
				.database()
				.ref('users/' + userToken)
				.once('value')
				.then(snapshot => {
					let user = snapshot.val();
					if (!user.game) {
						this.props.navigation.navigate('NoGameFound');
					} else {
						this.props.navigation.navigate('Home');
					}
				});
		}
	};

	render() {
		return (
			<View
				style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
			</View>
		);
	}
}
