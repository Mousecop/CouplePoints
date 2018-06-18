import React, { Component } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Dimensions,
	AsyncStorage
} from 'react-native';
import * as firebase from 'firebase';

export interface Props {
	navigation: any;
}

export class Home extends Component<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		return (
			<Button
				title="Signout"
				onPress={async () => {
					await AsyncStorage.removeItem('userToken');
					firebase.auth().signOut();
					this.props.navigation.navigate('Auth');
				}}
			/>
		);
	}
}
