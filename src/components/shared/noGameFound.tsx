import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo';
// Get Dimensions
const deviceHeight = Dimensions.get('screen').height;
// const deviceWidth = Dimensions.get('screen').width;

export interface Props {
	navigation: any;
}

export class NoGameFound extends Component<Props> {
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
			<LinearGradient colors={['#FF4E50', '#F9D423']} style={styles.contianer}>
				<View style={styles.contianer}>
					<View style={styles.textSection}>
						<Text style={styles.text}>
							Hey! It looks like you aren't in a game yet. You can create one or
							join a game that a friend has already made!
						</Text>
					</View>
					<View>
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate('Join')}>
							<View style={styles.button}>
								<Text style={styles.buttonText}>Join A Game</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => this.props.navigation.navigate('Create')}>
							<View style={styles.button}>
								<Text style={styles.buttonText}>Create A Game</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	contianer: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignContent: 'center',
		padding: 30
	},
	textSection: {
		marginTop: 20,
		marginBottom: deviceHeight / 6
	},
	text: {
		fontSize: 23,
		color: '#fff',
		fontWeight: 'bold',
		lineHeight: 33
	},
	button: {
		backgroundColor: '#81c6ff',
		marginBottom: 20,
		borderRadius: 10,
		height: 50,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center'
	},
	buttonText: {
		fontWeight: 'bold',
		color: '#fff',
		fontSize: 18
	}
});
