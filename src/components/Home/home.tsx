import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Text,
	StyleSheet,
	View,
	ActivityIndicator,
	Image,
	ScrollView,
	Dimensions,
	TouchableOpacity
} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Notifications } from 'expo';
import SubmitPoint from '../SubmitPoint/submitPoint';
import { BaseState } from '../../reducers/reducer';
import * as Actions from '../../actions/action';
import * as types from '../../types/type';
import NotificationModal from '../shared/notification-modal';
import { CashInModal } from '../shared/cashIn-modal';

// Get dimensions
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

export interface Props {
	navigation?: any;
	getCurrentUser: Function;
	getPlayerTwo: Function;
	getGame: Function;
	handleCashInSuccess: Function;
	game: types.Game;
	currentUser: types.User;
	playerTwo: types.User;
	notificationMode: string;
	setCashInNotificationMode: any;
}

export interface State {
	notification: any;
	isNotificationModalVisible: boolean;
	isCashinModalVisible: boolean;
	error: string;
}

export interface DispatchProps {
	getCurrentUser: Function;
	getPlayerTwo: Function;
	getGame: Function;
}

export class Home extends Component<Props, State> {
	static navigationOptions = {
		title: 'Couple Points',
		headerStyle: {
			backgroundColor: '#FF4E50',
			paddingBottom: 10,
			paddingHorizontal: 34
		},
		headerTitleStyle: {
			color: '#FFF',
			fontSize: 26
		},
		headerRight: <SubmitPoint />
	};

	constructor(props: Props) {
		super(props);

		this.state = {
			notification: {},
			isNotificationModalVisible: false,
			isCashinModalVisible: false,
			error: ''
		};
	}

	componentDidMount() {
		if (this.props.currentUser) {
			Notifications.addListener(this._handleNotificationModal);
		}
	}

	_handleNotificationModal = (notification: any) => {
		this.setState({
			notification: notification,
			isNotificationModalVisible: true
		});
	};

	renderPlayer = () => {
		const players = [this.props.currentUser, this.props.playerTwo];
		if (this.props.game && this.props.playerTwo) {
			return players.map((player: types.User, key: number) => {
				if (this.props.game.rules.length > 0) {
					const fillAmount =
						(player.points / this.props.game.rules.length) * 100;
					return (
						<View key={key} style={{ alignItems: 'center' }}>
							<View style={styles.profilePicture}>
								<AnimatedCircularProgress
									fill={fillAmount ? fillAmount : 0}
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
						</View>
					);
				} else {
					return (
						<View style={styles.container} key={key}>
							<ActivityIndicator />
						</View>
					);
				}
			});
		} else {
			return (
				<View style={styles.container}>
					<ActivityIndicator />
				</View>
			);
		}
	};

	renderPoints = () => {
		return this.props.game.rules.map((rule: types.Rule, key: number) => {
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

	setNotificationModalVisible = () => {
		this.setState({
			isNotificationModalVisible: !this.state.isNotificationModalVisible
		});
	};

	setCashInModalVisible = () => {
		this.setState({
			isCashinModalVisible: !this.state.isCashinModalVisible
		});
	};

	findRuleForCashIn = () => {
		if (this.props.game.rules) {
			return this.props.game.rules.find(
				x => x.id === this.props.currentUser.points
			);
		} else {
			return 'No rule found';
		}
	};

	render() {
		if (this.props.game && this.props.currentUser) {
			console.log('NOTIFICATION:', this.state.notification.data);
			return (
				<View style={styles.container}>
					{this.state.isNotificationModalVisible && (
						<NotificationModal
							isVisible={this.state.isNotificationModalVisible}
							closeModal={this.setNotificationModalVisible}
							reason={this.state.notification.data.data}
							notificationMode={this.state.notification.data.mode}
							cashInPlayerPoints={this.state.notification.data.points}
						/>
					)}

					<View style={{ marginBottom: 40 }}>
						<Text style={styles.gameNameText}>{this.props.game.gameName}</Text>
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
					<TouchableOpacity
						style={styles.cashInButton}
						onPress={() => {
							this.setCashInModalVisible();
						}}>
						<View>
							<Text style={styles.cashInText}>CASH IN</Text>
						</View>
					</TouchableOpacity>
					{this.state.isCashinModalVisible &&
						this.props.currentUser.points > 0 && (
							<CashInModal
								rule={this.findRuleForCashIn()}
								isVisible={this.state.isCashinModalVisible}
								closeModal={this.setCashInModalVisible}
								cashInConfirm={() =>
									this.props.handleCashInSuccess(
										this.props.currentUser,
										this.props.playerTwo.pushToken,
										this.findRuleForCashIn()
									)
								}
							/>
						)}
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

const mapStateToProps = (state: BaseState) => ({
	currentUser: state.currentUser,
	playerTwo: state.playerTwo,
	game: state.game,
	notificationMode: state.notificationMode
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
	},
	handleCashInSuccess(
		currentPlayer: any,
		playerTwoPushToken: any,
		reason: any
	) {
		dispatch(Actions.cashIn(currentPlayer, playerTwoPushToken, reason));
	},
	setCashInNotificationMode() {
		dispatch(Actions.cashInNotificationMode('cashIn'));
	}
});

export default connect<BaseState, DispatchProps>(
	mapStateToProps,
	mapDispatchToProps
)(Home);

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
