import * as firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import * as actionType from './actionTypes';

export const getCurrentUser = () => async (dispatch: any) => {
	const userToken = await AsyncStorage.getItem('userToken').then(
		result => result
	);
	firebase
		.database()
		.ref('users/' + userToken)
		.on('value', snapshot => {
			const user = snapshot.val();
			if (user) {
				return dispatch(getCurrentUserSucess({ ...user, playeId: userToken }));
			}
		});
};

// Have to use current user to find other player info in the same game
export const getPlayerTwo = () => async (dispatch: any) => {
	const userToken = await AsyncStorage.getItem('userToken').then(
		result => result
	);

	firebase
		.database()
		.ref('users/' + userToken + '/game')
		.once('value')
		.then(snapshot => {
			const gameId = snapshot.val();
			return gameId;
		})
		.then(gameId => {
			firebase
				.database()
				.ref('games/' + gameId)
				.once('value')
				.then(gameSnap => {
					const game = gameSnap.val();
					const playerTwoId = game.players.find((x: any) => x !== userToken);
					return playerTwoId;
				})
				.then(playerTwoId => {
					firebase
						.database()
						.ref('users/' + playerTwoId)
						.on('value', snapshot => {
							const playerTwo = snapshot.val();
							return dispatch(
								getPlayerTwoSucess({ ...playerTwo, playerId: playerTwoId })
							);
						});
				});
		});
};

export const getGame = () => async (dispatch: any) => {
	const userToken = await AsyncStorage.getItem('userToken').then(
		result => result
	);

	firebase
		.database()
		.ref('users/' + userToken + '/game')
		.once('value')
		.then(snapshot => {
			const gameId = snapshot.val();
			return gameId;
		})
		.then(gameId => {
			firebase
				.database()
				.ref('games/' + gameId)
				.once('value')
				.then(gameSnap => {
					const game = gameSnap.val();
					return dispatch(getGameSuccess({ ...game, gameId: gameId }));
				});
		});
};

export const submitPoint = (
	gameId: any,
	receivingPlayerId: any,
	playerTwoPushToken: any,
	reason: string
) => (dispatch: any) => {
	firebase
		.database()
		.ref('games/' + gameId + '/points')
		.push(reason)
		.then(() => {
			firebase
				.database()
				.ref('users/' + receivingPlayerId)
				.once('value')
				.then(snapshot => {
					const user = snapshot.val();
					firebase
						.database()
						.ref('users/' + receivingPlayerId)
						.update({ points: user.points + 1 })
						.then(() => {
							fetch('https://exp.host/--/api/v2/push/send', {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									'Accept-Encoding': 'gzip, deflate',
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									to: playerTwoPushToken,
									badge: 1,
									title: 'You just received a point!',
									body: `${reason}`,
									data: { data: reason },
									priority: 'high'
								})
							});
						});
				})
				.then(() => {
					dispatch(submitPointSucess(reason));
				});
		});
};

// Sync actions here:
export const getCurrentUserSucess = (user: Object) => ({
	type: actionType.GET_CURRENT_USER_SUCCESS,
	user
});

export const getPlayerTwoSucess = (playerTwo: Object) => ({
	type: actionType.GET_PLAYER_TWO_SUCESS,
	playerTwo
});

export const getGameSuccess = (game: Object) => ({
	type: actionType.GET_GAME,
	game
});

export const submitPointSucess = (data: any) => ({
	type: actionType.SUBMIT_POINT,
	data
});