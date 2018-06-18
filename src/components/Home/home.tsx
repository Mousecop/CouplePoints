import React, { Component } from 'react';
// import * as firebase from 'firebase';
import { InitialScreen } from '../shared/initalScreen';

export interface Props {
	navigation?: any;
}

export class Home extends Component<Props> {
	static navigationOptions = {
		title: 'Home',
		headerStyle: {
			backgroundColor: '#81c6ff'
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
			<InitialScreen navigation={this.props.navigation} />
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
