import Modal from 'react-native-modal';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import React from 'react';

// Get dimensions
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

export interface Props {
	rule: any;
	isVisible: boolean;
	closeModal: any;
	cashInConfirm: any;
}

export const CashInModal = (props: Props) => {
	let { rule, isVisible, closeModal, cashInConfirm } = props;
	console.log('RULE', rule);
	return (
		<View>
			<Modal
				isVisible={isVisible}
				onBackdropPress={() => {
					closeModal();
				}}
				style={{
					justifyContent: 'center',
					alignItems: 'center'
				}}
				animationOutTiming={500}
				backdropOpacity={0.5}
				animationIn="slideInUp">
				<View
					style={{
						backgroundColor: '#fff',
						height: deviceHeight / 5,
						width: deviceWidth / 1.1,
						padding: 15,
						borderRadius: 10,
						justifyContent: 'space-evenly'
					}}>
					<Text style={{ fontSize: 16, paddingBottom: 5 }}>
						Are you sure you want to Cash In all your points for:
					</Text>
					<Text style={{ paddingBottom: 10 }}>
						{rule.id} point{rule.id > 1 ? 's' : ''}: {rule.rule}
					</Text>
					<View
						style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
						<TouchableOpacity
							onPress={() => {
								cashInConfirm();
								closeModal();
							}}>
							<View
								style={{
									borderColor: '#53B295',
									borderWidth: 1,
									borderRadius: 6,
									backgroundColor: '#53B295',
									width: deviceWidth / 4,
									height: deviceHeight / 16,
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								<Text style={{ color: '#fff', fontWeight: 'bold' }}>Yes!</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity>
							<View
								style={{
									borderColor: '#FF4E50',
									borderWidth: 1,
									borderRadius: 6,
									backgroundColor: '#FF4E50',
									width: deviceWidth / 4,
									height: deviceHeight / 16,
									justifyContent: 'center',
									alignItems: 'center'
								}}>
								<Text style={{ color: '#fff', fontWeight: 'bold' }}>No!</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
};
