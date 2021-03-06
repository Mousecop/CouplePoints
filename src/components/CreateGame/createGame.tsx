import React, { Component } from 'react';
import {
	View,
	Text,
	StyleSheet,
	Dimensions,
	TextInput,
	TouchableOpacity,
	ScrollView,
	AsyncStorage
} from 'react-native';
import { LinearGradient } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';

// Get dimensions
const deviceHeight = Dimensions.get('screen').height;
const deviceWidth = Dimensions.get('screen').width;

export interface State {
	gameName: string;
	rules: { id: number; rule: string }[];
}

export interface Props {
	navigation: any;
}

export class CreateGame extends Component<Props, State> {
	static navigationOptions = {
		title: 'Create a game',
		headerStyle: {
			backgroundColor: '#FC354C',
			borderBottomColor: 'transparent'
		},
		headerTitleStyle: {
			fontSize: 20
		},
		headerTintColor: '#fff'
	};

	state: State = {
		gameName: '',
		rules: []
	};

	scrollView: any;

	componentWillMount() {
		if (this.state.rules.length < 1) {
			this.setState({
				rules: [...this.state.rules, { id: 1, rule: '' }]
			});
		}
	}

	renderPointRows = () => {
		return this.state.rules.map(rule => {
			return (
				<View style={styles.pointInputContainer} key={rule.id}>
					<Text>
						{rule.id} point<Text>{rule.id > 1 ? 's' : ''}</Text>:
					</Text>
					<View style={styles.pointInput}>
						<TextInput
							value={rule.rule}
							onChangeText={text => this.handleRuleText(rule.id, text)}
						/>
					</View>
				</View>
			);
		});
	};

	handleAddRulePress = () => {
		this.setState({
			rules: [
				...this.state.rules,
				{ id: this.state.rules.length + 1, rule: '' }
			]
		});
	};

	handleRuleText = (id: number, value: string) => {
		let rules = [...this.state.rules];
		let index = rules.findIndex(el => el.id === id);
		rules[index] = { id: id, rule: value };
		this.setState({ rules: rules });
	};

	handleButtonDisable = (): boolean => {
		return this.state.rules.every(el => el.rule === '');
	};

	createClick = async () => {
		if (this.state.rules && this.state.gameName) {
			const userToken = await AsyncStorage.getItem('userToken').then(result => {
				return result;
			});
			const newGameKey = firebase
				.database()
				.ref()
				.child('games')
				.push().key;

			firebase
				.database()
				.ref('games/' + newGameKey)
				.set({
					gameName: this.state.gameName,
					rules: this.state.rules,
					players: [userToken]
				})
				.then(() => {
					firebase
						.database()
						.ref('users/' + userToken)
						.update({
							game: newGameKey
						});
					this.props.navigation.navigate('Home');
				})
				.catch(err => console.log('CREATE ERROR:', err));
		}
	};

	render() {
		return (
			<LinearGradient colors={['#FC354C', '#0ABFBC']} style={styles.container}>
				<View>
					<View style={styles.cardContainer}>
						<View style={styles.nameCard}>
							<Text style={styles.gameNameText}>Game Name</Text>
							<View style={styles.gameNameInput}>
								<TextInput
									onChangeText={gameName => this.setState({ gameName })}
								/>
							</View>
						</View>
						<View style={styles.pointCard}>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignContent: 'center',
									marginBottom: 12
								}}>
								<Text style={styles.gameNameText}>Create Points</Text>
								<TouchableOpacity onPress={() => this.handleAddRulePress()}>
									<Ionicons
										name="ios-add-circle-outline"
										size={32}
										color="#35b243"
									/>
								</TouchableOpacity>
							</View>
							<ScrollView
								ref={ref => (this.scrollView = ref)}
								onContentSizeChange={() => {
									this.scrollView.scrollToEnd({ animated: true });
								}}>
								{this.renderPointRows()}
							</ScrollView>
						</View>
					</View>
					<TouchableOpacity
						disabled={this.handleButtonDisable()}
						onPress={() => this.createClick()}>
						<View style={styles.createButton}>
							<Text style={styles.buttonText}>Create</Text>
						</View>
					</TouchableOpacity>
				</View>
			</LinearGradient>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		padding: 15
	},
	cardContainer: {
		marginTop: 30
	},
	nameCard: {
		backgroundColor: '#fff',
		height: deviceHeight / 7,
		width: deviceWidth / 1.1,
		shadowColor: '#88abad',
		shadowRadius: 5,
		shadowOpacity: 1,
		shadowOffset: { width: 2, height: 2 },
		padding: 20
	},
	gameNameText: {
		fontSize: 17,
		marginBottom: 15,
		color: '#FC354C'
	},
	gameNameInput: {
		borderBottomWidth: 1,
		borderBottomColor: '#0ABFBC'
	},
	pointCard: {
		marginTop: 35,
		backgroundColor: '#fff',
		width: deviceWidth / 1.1,
		shadowColor: '#88abad',
		shadowRadius: 5,
		shadowOpacity: 1,
		shadowOffset: { width: 2, height: 2 },
		padding: 20,
		maxHeight: deviceHeight / 1.8
	},
	pointInputContainer: {
		flex: 1,
		flexDirection: 'row',
		marginVertical: 12
	},
	pointInput: {
		borderBottomWidth: 1,
		borderBottomColor: '#0ABFBC',
		width: deviceWidth / 1.3,
		marginLeft: 8
	},
	createButton: {
		height: 38,
		marginTop: 25,
		borderWidth: 2,
		borderColor: '#FFF',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 13
	},
	buttonText: {
		color: '#fff',
		fontWeight: 'bold',
		fontSize: 18
	}
});
