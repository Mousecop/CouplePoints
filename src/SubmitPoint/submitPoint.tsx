import React, { Component } from 'react';
import {
	View,
	Text,
	AsyncStorage,
	ActivityIndicator,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import * as firebase from 'firebase';

const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;
export interface State {
	receivingPlayerInfo: any;
	reason: string;
	userInfo: any;
}

export interface Props {
	navigation: any;
}

export class SubmitPoint extends Component<Props, State> {
	static navigationOptions = {
		title: 'Submit a Point',
		headerStyle: {
			backgroundColor: '#FF4E50',
			paddingBottom: 10
		},
		headerTitleStyle: {
			color: '#FFF',
			fontSize: 26
		},
		headerTintColor: '#fff'
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			receivingPlayerInfo: undefined,
			reason: '',
			userInfo: undefined
		};
	}

	componentDidMount() {
		this.getGameInfo();
	}

	// Get all game and player info need to submit a point
	getGameInfo = async () => {
		const userToken = await AsyncStorage.getItem('userToken').then(
			result => result
		);
		// Get current user info
		firebase
			.database()
			.ref('users/' + userToken)
			.once('value')
			.then(snapshot => {
				const userObj = snapshot.val();
				this.setState({
					userInfo: userObj
				});
				return userObj;
			})
			.then(user => {
				firebase
					.database()
					.ref('games/' + user.game)
					.once('value')
					.then(game => {
						// filter out current user from list of players
						const receivingPlayerId = game
							.val()
							.players.filter((id: any) => id !== userToken)[0];
						this.getReceivingPlayerInfo(receivingPlayerId);
					});
			});
	};

	getReceivingPlayerInfo = (playerId: any) => {
		firebase
			.database()
			.ref('users/' + playerId)
			.once('value')
			.then(snapshot => {
				this.setState(
					{
						receivingPlayerInfo: snapshot.val()
					},
					() => {
						console.log(this.state);
					}
				);
			});
	};

	render() {
		if (this.state.receivingPlayerInfo && this.state.userInfo) {
			return (
				<View style={styles.container}>
					<View style={styles.playerNameSection}>
						<Text style={styles.playerNameText}>
							Give a point to{' '}
							<Text style={{ color: '#FF4E50', fontWeight: 'bold' }}>
								{this.state.receivingPlayerInfo.firstName}{' '}
								{this.state.receivingPlayerInfo.lastName}
							</Text>
						</Text>
					</View>
					<View style={styles.reasonInputView}>
						<TextInput
							multiline={true}
							numberOfLines={4}
							placeholder="Reason for point"
							editable={true}
						/>
					</View>
					<TouchableOpacity>
						<View>
							<Text>Submit</Text>
						</View>
					</TouchableOpacity>
				</View>
			);
		} else {
			return (
				<View style={styles.container}>
					<ActivityIndicator />
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		padding: 25,
		alignItems: 'center'
	},
	playerNameSection: {
		marginVertical: 30
	},
	playerNameText: {
		fontSize: 22
	},
	reasonInputView: {
		borderWidth: 1,
		borderColor: 'grey',
		height: deviceHeight / 5,
		width: deviceWidth / 1.3
	}
});
