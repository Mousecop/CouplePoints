import React, { Component } from 'react';
// import * as firebase from 'firebase';
import { NoGameFound } from '../shared/noGameFound';
import { View, StyleSheet } from 'react-native';
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
			<View style={styles.container}>
				<NoGameFound navigation={this.props.navigation} />
			</View>
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
		flex: 1,
		backgroundColor: '#fff'
	}
});
