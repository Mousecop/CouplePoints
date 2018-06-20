import React, { Component } from 'react';
// import * as firebase from 'firebase';
// import { NoGameFound } from '../shared/noGameFound';
import { Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo';

export interface Props {
	navigation?: any;
}

export class Home extends Component<Props> {
	static navigationOptions = {
		title: 'Home',
		headerStyle: {
			backgroundColor: '#FF4E50',
			borderBottomColor: 'transparent'
		},
		headerTitleStyle: {
			color: '#FFF',
			fontSize: 20
		}
	};

	constructor(props: Props) {
		super(props);
	}
	render() {
		return (
			<LinearGradient colors={['#FF4E50', '#F9D423']} style={styles.container}>
				<Text>Hello Orld</Text>
			</LinearGradient>
			// <Button
			// 	title="Signout"
			// 	onPress={async () => {
			// 		await AsyncStorage.removeItem('userToken');
			// 		firebase.auth().signOut();
			// 		this.props.navigation.navigate('Auth');
			// 	}}
			// />
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
