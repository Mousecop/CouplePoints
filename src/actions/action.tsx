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
				return dispatch(getCurrentUserSucess({ ...user, playerId: userToken }));
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
							dispatch(submitPointSucess(reason));
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
									data: { data: reason, mode: 'submitPoint' },
									priority: 'high'
								})
							});
						});
				});
		});
};

export const cashIn = (
	currentPlayer: any,
	playerTwoPushToken: string,
	reason: any
) => async (dispatch: any) => {
	// User cashes in, need to update firebase with 0 points for currentUser,
	// notify playerTwo of Cash IN details
	console.log('currentPlayer', currentPlayer);
	await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Accept-Encoding': 'gzip, deflate',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			to: playerTwoPushToken,
			badge: 1,
			title: `${currentPlayer.firstName} just cashed in!`,
			body: `${reason.rule}`,
			data: { data: reason.rule, mode: 'cashIn', points: currentPlayer.points },
			priority: 'high'
		})
	}).then(() => {
		firebase
			.database()
			.ref('users/' + currentPlayer.playerId)
			.update({ points: 0 })
			.then(() => {
				dispatch(cashInNotificationMode('cashIn'));
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

export const cashInSuccess = () => ({
	type: actionType.CASH_IN
});

export const submitNotificationMode = (mode: any) => ({
	type: actionType.SUBMIT_NOTIFICATION_MODE,
	mode
});

export const cashInNotificationMode = (mode: any) => ({
	type: actionType.CASH_IN_NOTIFICATION_MODE,
	mode
});
