import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
	Text,
	StyleSheet,
	AsyncStorage,
	View,
	ActivityIndicator,
	Image,
	ScrollView,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
// Get dimensions
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

export interface Props {
	navigation?: any;
}

export interface State {
	user: any;
	game: any;
	players: any;
}

export class Home extends Component<Props, State> {
	static navigationOptions = {
		title: 'Couple Points',
		headerStyle: {
			backgroundColor: '#FF4E50',
			paddingBottom: 10
		},
		headerTitleStyle: {
			color: '#FFF',
			fontSize: 26
		}
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			user: undefined,
			game: undefined,
			players: []
		};

		this.initalizeGame();
	}

	initalizeGame = async () => {
		const userToken = await AsyncStorage.getItem('userToken').then(
			result => result
		);
		await firebase
			.database()
			.ref('users/' + userToken)
			.once('value')
			.then(snapshot => {
				let user = snapshot.val();
				this.setState({ user });
				firebase
					.database()
					.ref('games/' + user.game)
					.once('value')
					.then(gameSnapshot => {
						let game = gameSnapshot.val();

						this.setState({ game: game }, () => this.getPlayerInfo(game));
					})
					.catch(err => console.log(err));
			});
	};

	getPlayerInfo = (game: any): any => {
		game.players.forEach((playerId: any) => {
			firebase
				.database()
				.ref('users/' + playerId)
				.once('value')
				.then(snapshot => {
					let player = snapshot.val();
					this.setState({ players: [...this.state.players, player] });
				});
		});
	};

	renderPlayer = () => {
		return this.state.players.map((player: any, key: number) => {
			return (
				<View key={key} style={{ alignItems: 'center' }}>
					<View style={styles.profilePicture}>
						<AnimatedCircularProgress
							fill={(player.points / this.state.game.rules.length) * 100}
							size={170}
							width={3}
							tintColor="#FF4E4E"
							rotation={0}>
							{() => {
								return (
									<View>
										<Image
											source={{ uri: player.profilePicture }}
											style={{
												height: 160,
												width: 160,
												borderRadius: 80
											}}
										/>
										<View style={styles.imageOverlay}>
											<Text
												style={{
													color: '#FFF',
													fontSize: 24,
													alignSelf: 'center',
													justifyContent: 'center',
													flex: 1,
													fontWeight: 'bold'
												}}>
												{player.points}
											</Text>
										</View>
									</View>
								);
							}}
						</AnimatedCircularProgress>
					</View>

					{/* <Text style={styles.playerNameText}>
						{player.firstName} {player.lastName}
					</Text> */}
				</View>
			);
		});
	};

	renderPoints = () => {
		return this.state.game.rules.map((rule: any, key: number) => {
			return (
				<View key={key} style={styles.pointListContainer}>
					<Text style={styles.ruleText}>
						{rule.id} point{rule.id > 1 ? 's' : ''}:
					</Text>
					<Text style={styles.ruleText}>{rule.rule}</Text>
				</View>
			);
		});
	};

	render() {
		if (this.state.game && this.state.players && this.state.user) {
			return (
				<View style={styles.container}>
					<View style={{ marginBottom: 40 }}>
						<Text style={styles.gameNameText}>{this.state.game.gameName}</Text>
					</View>
					<View style={styles.profilePictureContainer}>
						{this.renderPlayer()}
					</View>
					<View style={{ width: deviceWidth }}>
						<View style={{ alignSelf: 'center', marginBottom: 15 }}>
							<Text style={styles.pointHeaderText}>Points</Text>
						</View>
						<ScrollView
							style={{
								height: deviceHeight / 3.5
							}}
							contentContainerStyle={{
								borderTopColor: 'gray',
								borderTopWidth: 1
							}}>
							{this.renderPoints()}
						</ScrollView>
					</View>
					<TouchableOpacity style={styles.cashInButton}>
						<View>
							<Text style={styles.cashInText}>CASH IN</Text>
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
		backgroundColor: '#FFF',
		padding: 13,
		alignItems: 'center',
		justifyContent: 'space-evenly'
	},
	gameNameText: {
		fontSize: 27,
		color: '#FF4E50'
	},
	profilePictureContainer: {
		flex: 0.5,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20
	},
	profilePicture: {
		shadowColor: '#88abad',
		shadowRadius: 7,
		shadowOpacity: 0.75,
		shadowOffset: { width: 3.5, height: 5.5 }
	},
	pointHeaderText: {
		fontSize: 27,
		color: '#FF4E50'
	},
	pointListContainer: {
		borderBottomWidth: 1,
		borderBottomColor: 'gray',

		flexDirection: 'row',
		padding: 16,
		marginVertical: 1,
		justifyContent: 'space-evenly',
		alignItems: 'center'
	},
	playerNameText: {
		color: '#087171'
	},
	ruleText: {
		fontSize: 17
	},
	cashInButton: {
		borderColor: '#53B295',
		borderWidth: 1.5,
		borderRadius: 10,
		backgroundColor: '#53B295',
		width: deviceWidth / 1.2,
		padding: 17,
		justifyContent: 'center',
		alignItems: 'center'
	},
	cashInText: {
		color: '#FFF',
		fontSize: 17,
		fontWeight: 'bold'
	},
	imageOverlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: 'rgba(0,0,0, 0.3)',
		height: 157,
		width: 157,
		borderRadius: 78.5,
		flex: 1
	}
});
