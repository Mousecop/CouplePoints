import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Dimensions
} from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as types from '../../types/type';
import Modal from 'react-native-modal';
import { BaseState } from '../../reducers/reducer';
import * as actions from '../../actions/action';
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

export interface State {
	reason: string;
	isModalVisible: boolean;
	error: string;
}

export interface Props {
	navigation: any;
	submitPoint: Function;
	game: types.Game;
	currentUser: types.User;
	playerTwo: types.User;
}

export interface DispatchProps {
	submitPoint: Function;
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
			reason: '',
			isModalVisible: false,
			error: undefined
		};
	}

	setModalVisible = (visible: boolean) => {
		this.setState({ isModalVisible: visible });
	};

	handleSubmit = () => {
		if (this.props.playerTwo.points < this.props.game.rules.length) {
			this.props.submitPoint(
				this.props.game.gameId,
				this.props.playerTwo.playerId,
				this.props.playerTwo.pushToken,
				this.state.reason
			);
			this.setModalVisible(!this.state.isModalVisible);
		} else {
			this.setState({
				error: 'Sorry but that person is at max points!'
			});
		}
	};

	render() {
		return (
			<View>
				<TouchableOpacity
					onPress={() => this.setModalVisible(!this.state.isModalVisible)}>
					<Ionicons name="ios-add-circle-outline" size={27} color="#fff" />
				</TouchableOpacity>
				{this.state.isModalVisible && (
					<View style={styles.container}>
						<Modal
							isVisible={this.state.isModalVisible}
							onSwipe={() => {
								this.setState({
									error: undefined,
									reason: ''
								});
								this.setModalVisible(!this.state.isModalVisible);
							}}
							swipeDirection="down"
							onBackdropPress={() => {
								this.setState({
									error: undefined,
									reason: ''
								});
								this.setModalVisible(!this.state.isModalVisible);
							}}
							style={{ justifyContent: 'flex-end', margin: 0 }}
							avoidKeyboard={true}
							animationOutTiming={500}>
							<View style={styles.modalContainer}>
								<View style={styles.playerNameSection}>
									<Text style={styles.playerNameText}>
										Give a point to{' '}
										<Text style={{ color: '#FF4E50', fontWeight: 'bold' }}>
											{this.props.playerTwo.firstName}{' '}
											{this.props.playerTwo.lastName}
										</Text>
									</Text>
								</View>
								<View style={styles.reasonInputView}>
									<TextInput
										multiline={true}
										numberOfLines={4}
										placeholder="Reason for point"
										editable={true}
										autoCorrect={true}
										style={styles.reasonInput}
										onChangeText={reason => this.setState({ reason })}
									/>
								</View>
								<TouchableOpacity
									onPress={() => this.handleSubmit()}
									disabled={!this.state.reason}>
									<View style={styles.submitButtonView}>
										<Text style={{ color: '#fff', fontWeight: 'bold' }}>
											Submit
										</Text>
									</View>
								</TouchableOpacity>
								{this.state.error && (
									<Text style={{ color: 'red' }}>{this.state.error}</Text>
								)}
							</View>
						</Modal>
					</View>
				)}
			</View>
		);
	}
}

const mapStateToProps = (state: BaseState) => ({
	game: state.game,
	currentUser: state.currentUser,
	playerTwo: state.playerTwo
});

const mapDispatchToProps = (dispatch: any) => ({
	submitPoint(
		gameId: any,
		receivingPlayerId: any,
		pushToken: string,
		reason: string
	) {
		dispatch(actions.submitPoint(gameId, receivingPlayerId, pushToken, reason));
	}
});

export default connect<BaseState, DispatchProps>(
	mapStateToProps,
	mapDispatchToProps
)(SubmitPoint);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modalContainer: {
		backgroundColor: '#fff',
		justifyContent: 'space-evenly',
		alignItems: 'center',
		height: deviceHeight / 1.99
	},
	playerNameSection: {
		// marginBottom: 30
	},
	playerNameText: {
		fontSize: 22
	},
	reasonInputView: {
		borderBottomWidth: 1,
		borderBottomColor: 'grey',
		borderLeftWidth: 1,
		borderLeftColor: 'grey',
		height: deviceHeight / 5,
		width: deviceWidth / 1.3,
		padding: 5
	},
	reasonInput: {
		fontSize: 22
	},
	submitButtonView: {
		borderWidth: 1,
		borderColor: '#FF4E50',
		borderRadius: 7,
		width: 100,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FF4E50'
	}
});
