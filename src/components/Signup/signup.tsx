import React, { Component } from 'react';
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Dimensions,
	AsyncStorage,
	Image,
	TouchableOpacity
} from 'react-native';
import * as firebase from 'firebase';
import { Camera, Permissions, ImagePicker } from 'expo';
// Get dimensions
const deviceWidth = Dimensions.get('screen').width;
const deviceHeight = Dimensions.get('screen').height;

export interface Props {
	navigation?: any;
}
export interface State {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	profilePicture: string;
	hasPermissions: any;
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
		password: '',
		firstName: '',
		lastName: '',
		profilePicture: '',
		hasPermissions: ''
	};

	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
		console.log(status);
		this.setState({ hasPermissions: status === 'granted' });
	}

	handleSignup() {
		firebase
			.auth()
			.createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then(async data => {
				console.log('NEW USER DATA:', data);
				this.sendUserDataToDB(data.user.uid);
				await AsyncStorage.setItem('userToken', data.user.uid);
				this.props.navigation.navigate('App');
			})
			.catch(err => console.log('ERROR:', err));
	}

	sendUserDataToDB(userId: any) {
		firebase
			.database()
			.ref('users/' + userId)
			.set({
				email: this.state.email,
				firstName: this.state.firstName,
				lastName: this.state.lastName,
				profilePicture: this.state.profilePicture
			});
	}

	checkIfFormComplete() {
		if (this.state.password === '' || this.state.email === '') {
			return true;
		}
		return false;
	}

	openCameraRoll = async () => {
		if (this.state.hasPermissions) {
			await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3]
			}).then(image => {
				console.log(image);
				this.setState({ profilePicture: image.uri });
			});
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<Text style={styles.headerText}>Couple Points</Text>
				<View style={styles.inputContainer}>
					<View>
						<View style={styles.profileImageContainer}>
							<TouchableOpacity onPress={() => this.openCameraRoll()}>
								<Image
									source={
										this.state.profilePicture
											? { uri: this.state.profilePicture }
											: require('../../../assets/images/profile-placeholder.png')
									}
									style={styles.profileImage}
								/>
								<Text style={{ color: '#fff' }}>Upload your picture</Text>
							</TouchableOpacity>
						</View>
						<View>
							<TextInput
								placeholder="First Name"
								placeholderTextColor="#7492b5"
								autoCorrect={false}
								onChangeText={firstName => this.setState({ firstName })}
								style={styles.input}
							/>
						</View>
						<View>
							<TextInput
								placeholder="Last Name"
								placeholderTextColor="#7492b5"
								autoCorrect={false}
								onChangeText={lastName => this.setState({ lastName })}
								style={styles.input}
							/>
						</View>
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
		padding: 30
	},
	headerText: {
		fontSize: 40,
		color: '#FFF'
	},
	inputContainer: {
		flex: 0.8,
		justifyContent: 'center',
		marginBottom: 20
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
	},
	profileImage: {
		width: 100,
		height: 100,
		borderRadius: 50,
		alignSelf: 'center',
		marginBottom: 10
	},
	profileImageContainer: {
		alignSelf: 'center',
		justifyContent: 'center',
		marginBottom: 20
	}
});
