import React, { Component } from 'react';
import { View, TouchableOpacity, Text, AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

export interface Props {
	navigation?: any;
}
export class Profile extends Component<Props> {
	handleSignout = async () => {
		await AsyncStorage.removeItem('userToken');
		firebase
			.auth()
			.signOut()
			.then(() => this.props.navigation.navigate('Auth'));
	};

	render() {
		return (
			<TouchableOpacity
				onPress={() => this.handleSignout()}
				style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<View>
					<Text>Signout</Text>
				</View>
			</TouchableOpacity>
		);
	}
}
