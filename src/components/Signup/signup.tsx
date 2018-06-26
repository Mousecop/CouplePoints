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
import { Permissions, ImagePicker } from 'expo';
import { RNS3 } from 'react-native-aws3';
import * as env from '../../env';
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

export interface S3 {
	keyPrefix: string;
	bucket: string;
	region: string;
	accessKey: string;
	secretKey: string;
	succesActionStatus: number;
}

// Setup S3 options
const s3Options: S3 = {
	keyPrefix: 'upload/',
	bucket: 'couple-points',
	region: 'us-east-1',
	accessKey: env.AWS_ACCESS,
	secretKey: env.AWS_SECRET,
	succesActionStatus: 201
};
export class Signup extends Component<Props, State> {
	static navigationOptions = {
		headerStyle: {
			backgroundColor: '#81c6ff',
			borderBottomColor: 'transparent'
		},
		title: 'Signup',
		headerTitleStyle: {
			color: '#FFF',
			fontSize: 20
		}
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

	handleSignup = async () => {
		await firebase
			.auth()
			.createUserWithEmailAndPassword(this.state.email, this.state.password)
			.then(async data => {
				await AsyncStorage.setItem('userToken', data.user.uid);
				await this.handleUploadToS3(data.user.uid);
			})
			.then(() => {
				this.props.navigation.navigate('App');
			})
			.catch(err => console.log('ERROR:', err));
	};

	checkIfFormComplete = () => {
		if (this.state.password === '' || this.state.email === '') {
			return true;
		}
		return false;
	};

	openCameraRoll = async () => {
		if (this.state.hasPermissions) {
			await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3]
			}).then((image: any) => {
				console.log(image);
				this.setState({ profilePicture: image.uri });
			});
		}
	};

	handleUploadToS3 = async (userId: any) => {
		const file = {
			uri: this.state.profilePicture,
			name: `profile-image-${userId}.png`,
			type: 'image/png'
		};
		await RNS3.put(file, s3Options).then((response: any) => {
			if (response.status !== 201) {
				throw new Error('Failed to upload to S3');
			}
			console.log('S3 RESPONSE', response.body);

			firebase
				.database()
				.ref('users/' + userId)
				.set({
					email: this.state.email,
					firstName: this.state.firstName,
					lastName: this.state.lastName,
					profilePicture: response.body.postResponse.location,
					points: 0
				});
		});
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
