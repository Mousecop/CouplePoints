import Modal from 'react-native-modal';
import { View, Text, Dimensions } from 'react-native';
import React, { Component } from 'react';
import { User } from '../../types/type';

// Get dimensions
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

export interface Props {
	reason: string;
	playerTwo: User;
	isVisible: boolean;
	closeModal: any;
	currentUser: User;
	notificationMode: string;
}

export class NotificationModal extends Component<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		let {
			notificationMode,
			currentUser,
			isVisible,
			closeModal,
			playerTwo,
			reason
		} = this.props;
		let modalVisible = isVisible;
		console.log('notificationMode:', notificationMode);
		if (notificationMode === 'submitPoint') {
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
							<Text style={{ fontSize: 16, paddingBottom: 10 }}>
								You have received a point from {playerTwo.firstName}{' '}
								{playerTwo.lastName}!
							</Text>
							<Text style={{ fontSize: 14 }}>For: {reason.trim()}</Text>
						</View>
					</Modal>
				</View>
			);
		} else if (notificationMode === 'cashIn') {
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
							<Text style={{ fontSize: 16, paddingBottom: 10 }}>
								{currentUser.firstName} just cashed in {currentUser.points}{' '}
								point{currentUser.points > 1 ? 's' : ''}!
							</Text>
							<Text style={{ fontSize: 14 }}>For: {reason.trim()}</Text>
						</View>
					</Modal>
				</View>
			);
		} else {
			return '';
		}
	}
}
