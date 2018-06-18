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

// Get dimensions
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export interface Props {
	navigation?: any;
}
export interface State {
	email: string;
	password: string;
}
export class Signup extends Component<Props, State> {
	static navigationOptions = {
		headerStyle: {
			backgroundColor: '#81c6ff',
			borderBottomColor: 'transparent'
		},
		title: 'Signup'
	};

	state = {
		email: '',
		password: ''
	};

	handleSignup() {
		firebase
			.auth()
			.createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then(async data => {
				console.log('NEW USER DATA:', data);
				await AsyncStorage.setItem('userToken', data.user.uid);
				this.props.navigation.navigate('App');
			})
			.catch(err => console.log('ERROR:', err));
	}

	checkIfFormComplete() {
		if (this.state.password === '' || this.state.email === '') {
			return true;
		}
		return false;
	}

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.headerText}>Couple Points</Text>
				<View style={styles.inputContainer}>
					<View style={styles.emailInputContainer}>
						<TextInput
							placeholder="Email"
							placeholderTextColor="#7492b5"
							onChangeText={email => {
								this.setState({ email });
							}}
							autoCapitalize="none"
							value={this.state.email}
							style={styles.input}
						/>
					</View>
					<View>
						<TextInput
							placeholder="Password"
							placeholderTextColor="#7492b5"
							secureTextEntry
							onChangeText={password => this.setState({ password })}
							style={styles.input}
						/>
					</View>
				</View>
				<View style={styles.button}>
					<Button
						title="Sign Up"
						onPress={() => this.handleSignup()}
						color="#fff"
						disabled={this.checkIfFormComplete()}
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#81c6ff',
		height: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		flex: 1,
		padding: 40
	},
	headerText: {
		fontSize: 40,
		color: '#FFF'
	},
	inputContainer: {
		flex: 0.8,
		justifyContent: 'center'
	},
	emailInputContainer: {
		marginBottom: 15
	},
	input: {
		borderBottomColor: '#fff',
		borderBottomWidth: 1,
		width: deviceWidth / 1.3,
		height: deviceHeight / 12,
		color: '#fff'
	},
	button: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: '#fff',
		padding: 5,
		width: deviceWidth / 1.3
	}
});
