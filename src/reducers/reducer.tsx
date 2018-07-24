import * as actions from '../actions/actionTypes';
import * as types from '../types/type';
export interface BaseState {
	currentUser: types.User;
	playerTwo: types.User;
	game: types.Game;
}

const initalState: BaseState = {
	currentUser: {
		email: '',
		firstName: '',
		game: '',
		lastName: '',
		points: 0,
		profilePicture: '',
		playerId: '',
		pushToken: ''
	},
	playerTwo: {
		email: '',
		firstName: '',
		game: '',
		lastName: '',
		points: 0,
		profilePicture: '',
		playerId: '',
		pushToken: ''
	},
	game: {
		gameName: '',
		players: [],
		points: [],
		rules: [],
		gameId: ''
	}
};

export const reducer = (state = initalState, action: any) => {
	switch (action.type) {
		case actions.GET_CURRENT_USER_SUCCESS:
			console.log('ACTION CURRENT USER:', action.user);
			return { ...state, currentUser: action.user };
		case actions.GET_PLAYER_TWO_SUCESS:
			console.log('ACTION PLAYER TWO:', action.playerTwo);
			return { ...state, playerTwo: action.playerTwo };
		case actions.GET_GAME:
			console.log('ACTION GAME:', action.game);
			return { ...state, game: action.game };
		default:
			return state;
	}
};
