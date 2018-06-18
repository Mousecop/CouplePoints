import React, { Component } from 'react';
import { View, Button } from 'react-native';

export interface Props {
	navigation: any;
}

export class InitialScreen extends Component<Props> {
	constructor(props: Props) {
		super(props);
	}
	render() {
		return (
			<View>
				<View>
					<View>
						<Button
							title="Join a game"
							onPress={() => this.props.navigation.navigate('Join')}
						/>
					</View>
					<View>
						<Button
							title="Create a game"
							onPress={() => this.props.navigation.navigate('Create')}
						/>
					</View>
				</View>
			</View>
		);
	}
}
