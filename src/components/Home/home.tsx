import React, { Component } from 'react';
import * as firebase from 'firebase';
import {
	Text,
	StyleSheet,
	AsyncStorage,
	View,
	ActivityIndicator,
	Image
} from 'react-native';

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
			backgroundColor: '#FFF',
			paddingBottom: 10
		},
		headerTitleStyle: {
			color: '#FF4E50',
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
					<Image
						source={{ uri: player.profilePicture }}
						style={{ height: 120, width: 120, borderRadius: 60 }}
					/>
					<Text>
						{player.firstName} {player.lastName}
					</Text>
				</View>
			);
		});
	};

	render() {
		if (this.state.game && this.state.players && this.state.user) {
			return (
				<View style={styles.container}>
					<View>
						<Text style={styles.gameNameText}>{this.state.game.gameName}</Text>
					</View>
					<View style={styles.profilePictureContainer}>
						{this.renderPlayer()}
					</View>
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
		padding: 20,
		alignItems: 'center'
	},
	gameNameText: {
		fontSize: 27
	},
	profilePictureContainer: {
		flex: 0.5,
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 20
	}
});
