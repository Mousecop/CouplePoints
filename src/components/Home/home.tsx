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
import Modal from 'react-native-modal';
// Get dimensions
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

export interface Props {
	navigation?: any;
	getCurrentUser: Function;
	getPlayerTwo: Function;
	getGame: Function;
	game: types.Game;
	currentUser: types.User;
	playerTwo: types.User;
}

export interface State {
	notification: any;
	isModalVisible: boolean;
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
			paddingRight: 34
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
			isModalVisible: false
		};
	}

	componentDidMount() {
		if (this.props.currentUser) {
			Notifications.addListener(this._handleNotification);
		}
	}

	_handleNotification = (notification: any) => {
		this.setState({
			notification: notification,
			isModalVisible: true
		});
	};

	renderPlayer = () => {
		const players = [this.props.currentUser, this.props.playerTwo];
		if (this.props.game && this.props.playerTwo) {
			return players.map((player: types.User, key: number) => {
				const fillAmount =
					(player.points / this.props.game.rules.length) * 100 || 0;
				console.log('FILL AMOUNT', fillAmount);
				return (
					<View key={key} style={{ alignItems: 'center' }}>
						<View style={styles.profilePicture}>
							<AnimatedCircularProgress
								fill={100}
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

	setModalVisible = (visible: boolean) => {
		this.setState({ isModalVisible: visible });
	};

	renderNotification = () => {
		return (
			<View style={{}}>
				<Modal
					isVisible={this.state.isModalVisible}
					onSwipe={() => {
						this.setModalVisible(!this.state.isModalVisible);
					}}
					swipeDirection="up"
					onBackdropPress={() => {
						this.setModalVisible(!this.state.isModalVisible);
					}}
					style={{
						justifyContent: 'flex-start',
						marginTop: 15,
						alignItems: 'center'
					}}
					animationOutTiming={500}
					backdropOpacity={0.5}>
					<View
						style={{
							backgroundColor: '#fff',
							height: deviceHeight / 9.5,
							width: deviceWidth / 1.1,
							padding: 15,
							borderRadius: 10,
							justifyContent: 'space-evenly'
						}}>
						<Text style={{ fontSize: 16, paddingBottom: 10 }}>
							You have received a point from {this.props.playerTwo.firstName}{' '}
							{this.props.playerTwo.lastName}!
						</Text>
						<Text style={{ fontSize: 14 }}>
							For: {this.state.notification.data.data.trim()}
						</Text>
					</View>
				</Modal>
			</View>
		);
	};

	render() {
		console.log('GAME:', this.props.game);
		if (this.props.game && this.props.currentUser) {
			return (
				<View style={styles.container}>
					{this.state.isModalVisible && this.renderNotification()}
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
