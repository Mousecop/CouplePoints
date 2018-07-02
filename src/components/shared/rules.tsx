import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('screen').height;
export class Rules extends Component {
	static navigationOptions = {
		title: 'Rules',
		headerStyle: {
			backgroundColor: '#FF4E50',
			paddingBottom: 10
		},
		headerTitleStyle: {
			color: '#FFF',
			fontSize: 26
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<ScrollView style={{ height: deviceHeight * 2 }}>
					<Text style={[styles.hightlightTextGreen, styles.largeText]}>
						Introduction
					</Text>
					<Text style={styles.textContainer}>
						<Text style={styles.hightlightTextRed}>Couple Points</Text>{' '}
						<Text style={styles.introSentence}>
							is the ultimate reward game. You and your partner simply create a
							game, set your rewards, and start earning points.
							{'\n'}
							{'\n'}
						</Text>
						<Text>
							How do you earn points, you ask? Easy. Just be nice and show each
							other that you love one another. Once you have accrued some
							points, you can “Cash In”, which means you spend all your points
							to then get the reward. The reward you receive is based off the
							point value y’all set up in the beginning.
							{'\n'}
							{'\n'}
						</Text>
						<Text>
							For example: Let’s say that I randomly got my girlfriend flowers.
							She then could award me a point. I could then “Cash In” my 3 total
							points to ,let’s say, make out. I could have also given a really
							nice, genuine compliment. That could also be considered a point.
							{'\n'}
							{'\n'}
						</Text>
						<Text>
							The possibilities are endless and y’all create the rules!
						</Text>
					</Text>
					<View style={styles.ruleSection}>
						<Text style={[styles.hightlightTextGreen, styles.largeText]}>
							Rules
						</Text>
						<Text style={styles.introSentence}>
							<Text>
								<Text style={styles.hightlightTextRed}>1:</Text> The person who
								gives the point, dictates whether or not the act of kindness was
								worthy.
								{'\n'}
								{'\n'}
							</Text>
							<Text>
								<Text style={styles.hightlightTextRed}>2:</Text> If you “Cash
								In”, you cash in all of your points. You may not split up your
								points. It’s all or nothing!
								{'\n'}
								{'\n'}
							</Text>
							<Text>
								<Text style={styles.hightlightTextRed}>3:</Text> If you “Cash
								In”, both parties have to honor the rule you setup. So be
								careful with what you commit to. ;)
							</Text>
						</Text>
					</View>
				</ScrollView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		padding: 20
	},
	textContainer: {
		lineHeight: 200,
		fontSize: 17
	},
	hightlightTextGreen: {
		color: '#53B295'
	},
	hightlightTextRed: {
		color: '#FF4E50'
	},
	largeText: {
		fontSize: 24,
		marginBottom: 15
	},
	introSentence: {
		fontSize: 18
	},
	ruleSection: {
		marginTop: 30
	},
	ruleText: {
		marginVertical: '15'
	}
});
