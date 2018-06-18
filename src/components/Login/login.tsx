import React, { Component } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Dimensions
} from 'react-native';
import * as firebase from 'firebase';

// Get dimensions
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export class Login extends Component {
	static navigationOptions = {
		headerStyle: {
			backgroundColor: '#81c6ff',
			borderBottomColor: 'transparent'
		}
	};

	state = {
		email: '',
		password: ''
	};

	handleLogin() {
		firebase
			.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then(data => console.log('Logged in user:', data))
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
						title="Login"
						color="#fff"
						onPress={() => this.handleLogin()}
						disabled={this.checkIfFormComplete()}
					/>
				</View>
				<View>
					<Text style={{ color: '#8193b3' }}>
						New User?{' '}
						<Text onPress={() => this.props.navigation.navigate('Signup')}>
							Create a new account
						</Text>
					</Text>
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
		color: '#fff',
		fontSize: 20
	},
	button: {
		borderWidth: 1,
		borderRadius: 10,
		borderColor: '#fff',
		padding: 5,
		width: deviceWidth / 1.3,
		marginBottom: 10
	}
});
