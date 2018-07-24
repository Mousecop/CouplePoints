import Modal from 'react-native-modal';
import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { User } from '../../types/type';

// Get dimensions
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

export interface Props {
	reason: string;
	playerTwo: User;
	isVisible: boolean;
	closeModal: any;
}

export const NotificationModal = (props: Props) => {
	let { reason, playerTwo, isVisible, closeModal } = props;
	let modalVisible = isVisible;
	console.log('MODAL VISIBLE:', modalVisible);
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
};
