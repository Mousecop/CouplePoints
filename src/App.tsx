import React from 'react';
import * as firebase from 'firebase';
import AppNavigator from './navigation/AppNavigator';
import { AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import store from './store';
const firebaseConfig = {
	apiKey: 'AIzaSyCP8JDSIlp26GvTIkJe84FmFNitp1-p864',
	authDomain: 'couplepoints-2bdbe.firebaseapp.com',
	databaseURL: 'https://couplepoints-2bdbe.firebaseio.com',
	projectId: 'couplepoints-2bdbe',
	storageBucket: '',
	messagingSenderId: '453625238827'
};

firebase.initializeApp(firebaseConfig);
export default class App extends React.Component {
	render() {
		// AsyncStorage.clear();
		return (
			<Provider store={store}>
				<AppNavigator />
			</Provider>
		);
	}
}
