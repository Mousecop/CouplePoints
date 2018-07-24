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
import { connect } from 'react-redux';
import * as actions from '../../actions/action';
import * as types from '../../types/type';
import * as firebase from 'firebase';
import { BaseState } from '../../reducers/reducer';
import { registerForPushNotificationsAsync } from '../shared/registerForPushNotificationsAsync';
// Get dimensions
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export interface Props {
	navigation?: any;
	currentUser: types.User;
	playerTwo: types.User;
	handleNotification: Function;
}

export interface State {
	email: string;
	password: string;
}

export interface DispatchProps {
	handleNotification: Function;
}

export interface StateProps {
	currentUser: types.User;
	playerTwo: types.User;
}

export class Login extends Component<Props, State> {
	static navigationOptions = {
		headerStyle: {
			backgroundColor: '#FF4E50',
			borderBottomColor: 'transparent'
		}
	};
	constructor(props: Props) {
		super(props);
		this.state = {
			email: '',
			password: ''
		};
	}

	handleLogin = () => {
		firebase
			.auth()
			.signInWithEmailAndPassword(this.state.email, this.state.password)
			.then(async data => {
				if (data) {
					await AsyncStorage.setItem('userToken', data.user.uid);
					registerForPushNotificationsAsync(data.user.uid);
					this.props.navigation.navigate('App');
				}
			})
			.catch(err => console.log('ERROR:', err));
	};

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
							placeholderTextColor="#fff"
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
							placeholderTextColor="#fff"
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
					<Text style={{ color: '#FFF' }}>
						New User?{' '}
						<Text
							onPress={() => this.props.navigation.navigate('Signup')}
							style={{ color: '#81c6ff' }}>
							Create a new account
						</Text>
					</Text>
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state: BaseState) => ({
	currentUser: state.currentUser,
	playerTwo: state.playerTwo
});

export default connect<StateProps, DispatchProps>(mapStateToProps)(Login);

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FF4E50',
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
		borderWidth: 2,
		borderRadius: 10,
		borderColor: '#fff',
		padding: 5,
		width: deviceWidth / 1.3,
		marginBottom: 10
	}
});
