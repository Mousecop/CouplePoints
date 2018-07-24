import React, { Component } from 'react';
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { BaseState } from '../reducers/reducer';
import * as Actions from '../actions/action';
export interface Props {
	navigation: any;
	getCurrentUser: Function;
	getPlayerTwo: Function;
	getGame: Function;
	game: any;
	currentUser: any;
	playerTwo: any;
}

export interface DispatchProps {
	getCurrentUser: Function;
	getPlayerTwo: Function;
	getGame: Function;
}

export class HomeLoading extends Component<Props> {
	constructor(props: Props) {
		super(props);
		this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		const userToken = await AsyncStorage.getItem('userToken').then(
			result => result
		);

		if (userToken) {
			this.props.getCurrentUser();
			this.props.getGame();
			this.props.getPlayerTwo();
			firebase
				.database()
				.ref('users/' + userToken)
				.once('value')
				.then(snapshot => {
					let user = snapshot.val();
					if (!user.game) {
						this.props.navigation.navigate('NoGameFound');
					} else {
						this.props.navigation.navigate('Home');
					}
				});
		}
	};

	render() {
		return (
			<View
				style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
				<ActivityIndicator />
				<StatusBar barStyle="default" />
			</View>
		);
	}
}

const mapStateToProps = (state: BaseState) => ({
	currentUser: state.currentUser,
	playerTwo: state.playerTwo,
	game: state.game
});

const mapDispatchToProps = (dispatch: any) => ({
	getCurrentUser() {
		dispatch(Actions.getCurrentUser());
	},
	getPlayerTwo() {
		dispatch(Actions.getPlayerTwo());
	},
	getGame() {
		dispatch(Actions.getGame());
	}
});

export default connect<BaseState, DispatchProps>(
	mapStateToProps,
	mapDispatchToProps
)(HomeLoading);
