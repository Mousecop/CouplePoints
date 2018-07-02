import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	AsyncStorage
} from 'react-native';
import { LinearGradient } from 'expo';
import * as firebase from 'firebase';
export interface Props {
	navigation?: any;
}

export interface State {
	gameName: string;
	games: any[];
	error: any;
}
export class JoinGame extends Component<Props, State> {
	static navigationOptions = {
		title: 'Join Game',
		headerStyle: {
			backgroundColor: '#11998e',
			paddingBottom: 10,
			borderBottomColor: 'transparent'
		},
		headerTitleStyle: {
			color: '#FFF',
			fontSize: 25
		},
		headerTintColor: '#fff'
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			gameName: '',
			games: [],
			error: undefined
		};
	}

	// Intial loading of game details to update state so we can check if user found the correct game.
	componentDidMount() {
		let tempArray: any = [];
		firebase
			.database()
			.ref('games/')
			.once('value')
			.then(snapshot => {
				let gameObj = snapshot.val();
				for (let item in gameObj) {
					if (gameObj.hasOwnProperty(item)) {
						tempArray.push({ game: { ...gameObj[item], gameId: item } });
					}
				}
				return tempArray;
			})
			.then((array: any) => {
				array.forEach((item: any) => {
					this.setState({ games: [...this.state.games, item] });
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	// handleJoin references the DB multiple times:
	// 1st to get the array of players.
	// 2nd to update array of players on the game.
	// 3rd to update user with the gameID they joined
	handleJoin = async () => {
		const userToken = await AsyncStorage.getItem('userToken').then(result => {
			return result;
		});
		if (this.state.gameName && this.state.games.length > 0) {
			let correctGame = this.state.games.find(ele => {
				return ele.game.gameName === this.state.gameName;
			});

			console.log(correctGame);
			if (!correctGame) {
				this.setState({ error: 'No Game found' });
			} else {
				if (correctGame.game.players.length >= 2) {
					this.setState({
						error: 'Sorry there are too many players already playing that game'
					});
				} else {
					firebase
						.database()
						.ref('games/' + correctGame.game.gameId + '/players')
						.once('value')
						.then((snapshot: any) => {
							const playersArray = snapshot.val();
							playersArray.push(userToken);
							return playersArray;
						})
						.then((players: any) => {
							firebase
								.database()
								.ref('games/' + correctGame.game.gameId + '/players')
								.set(players)
								.then(() => {
									firebase
										.database()
										.ref('users/' + userToken)
										.update({ game: correctGame.game.gameId })
										.then(() => {
											this.props.navigation.navigate('App');
										});
								});
						});
				}
			}
		}
	};

	render() {
		return (
			<LinearGradient colors={['#11998e', '#38ef7d']} style={styles.container}>
				<View style={styles.mainContentSection}>
					<View>
						<Text style={styles.introText}>
							Simply enter a game name below to be added!
						</Text>
					</View>
					<View style={styles.textInput}>
						<TextInput
							placeholder="Game Name"
							placeholderTextColor="#fff"
							style={{ color: '#fff', fontSize: 22 }}
							onChangeText={gameName => this.setState({ gameName })}
						/>
					</View>
					{this.state.error && (
						<Text style={{ color: 'red' }}>{this.state.error}</Text>
					)}
					<TouchableOpacity
						style={styles.joinButton}
						onPress={() => this.handleJoin()}
						disabled={this.state.gameName ? false : true}>
						<View>
							<Text style={styles.joinButtonText}>Join</Text>
						</View>
					</TouchableOpacity>
				</View>
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 30
	},
	mainContentSection: {
		justifyContent: 'space-evenly',
		flex: 0.75
	},
	introText: {
		color: '#fff',
		fontSize: 26,
		fontWeight: 'bold'
	},
	textInput: {
		borderBottomColor: '#fff',
		borderBottomWidth: 2,
		paddingBottom: 14
	},
	joinButton: {
		borderColor: '#FFF',
		borderWidth: 2,
		borderRadius: 7,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20
	},
	joinButtonText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: 'bold'
	}
});
