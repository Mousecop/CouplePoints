import Modal from 'react-native-modal';
import { View, Text, Dimensions, ActivityIndicator } from 'react-native';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { User, Game } from '../../types/type';
import { BaseState } from '../../reducers/reducer';

// Get dimensions
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

export interface Props {
	reason: string;
	playerTwo: User;
	isVisible: boolean;
	game: Game;
	closeModal: any;
	currentUser: User;
	notificationMode: string;
	cashInPlayerPoints: any;
}

export class NotificationModal extends Component<Props, {}> {
	constructor(props: Props) {
		super(props);
	}

	renderText = () => {
		console.log(this.props.cashInPlayerPoints);
		if (this.props.notificationMode === 'submitPoint') {
			return (
				<Text style={{ fontSize: 16, paddingBottom: 10 }}>
					You have received a point from {this.props.playerTwo.firstName}{' '}
					{this.props.playerTwo.lastName}!
				</Text>
			);
		} else {
			return (
				<Text style={{ fontSize: 16, paddingBottom: 10 }}>
					{this.props.playerTwo.firstName} just cashed in{' '}
					{this.props.cashInPlayerPoints} point{this.props.cashInPlayerPoints >
					1
						? 's'
						: ''}!
				</Text>
			);
		}
	};
	render() {
		let { isVisible, closeModal, reason } = this.props;
		let modalVisible = isVisible;
		return (
			<View>
				<Modal
					isVisible={modalVisible}
					onSwipe={() => {
						closeModal();
					}}
					swipeDirection="down"
					onBackdropPress={() => {
						closeModal();
					}}
					style={{
						justifyContent: 'flex-start',
						marginTop: 15,
						alignItems: 'center'
					}}
					animationOutTiming={500}
					backdropOpacity={0.5}
					animationIn="slideInDown">
					<View
						style={{
							backgroundColor: '#fff',
							height: deviceHeight / 9.5,
							width: deviceWidth / 1.1,
							padding: 15,
							borderRadius: 10,
							justifyContent: 'space-evenly'
						}}>
						{this.renderText()}
						<Text style={{ fontSize: 14 }}>For: {reason.trim()}</Text>
					</View>
				</Modal>
			</View>
		);
	}
}

const mapStateToProps = (state: BaseState) => ({
	currentUser: state.currentUser,
	playerTwo: state.playerTwo,
	game: state.game
});

export default connect(mapStateToProps)(NotificationModal);
