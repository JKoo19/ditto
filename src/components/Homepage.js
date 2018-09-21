import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Avatar, SocialIcon } from 'react-native-elements';
import SignUpEmailPage from './signUpEmailPage';
import LoginPage from './LoginPage';

class Homepage extends Component {
	state = { signup: false, login: false, loading: false };

	onSignUpButtonPress() {
		this.setState({ loading: true, signup: true });
	}
	onLogInButtonPress() {
		this.setState({ loading: true, login: true });
	}

	renderSignUpButton() {
		if (this.state.loading) {
			return (
				<Button
				loading
				style={{ marginTop: 150 }}
				titleStyle={{ fontWeight: '700' }}
				buttonStyle={styles.buttonStyle}
				/>
				);
		}
		return (
			<Button
				style={{ marginTop: 150 }}
				title="SIGN UP"
				titleStyle={{ fontWeight: '700' }}
				buttonStyle={styles.buttonStyle}
				onPress={this.onSignUpButtonPress.bind(this)}
			/>
			);
	}

	renderLogInButton() {
		if (this.state.loading) {
			return (
				<Button
				loading
				style={{ marginTop: 150 }}
				titleStyle={{ fontWeight: '700' }}
				buttonStyle={styles.buttonStyle}
				/>
				);
		}
		return (
			<Button
				title="LOG IN"
				titleStyle={{ fontWeight: '700' }}
				buttonStyle={styles.buttonStyle}
				onPress={this.onLogInButtonPress.bind(this)}
			/>
			);
	}

	render() {
	if (this.state.signup) {
		return (
			<SignUpEmailPage />
			);
		} 
	if (this.state.login) {
		return <LoginPage />;
		}

		return (
			<View style={styles.containerStyle}>
			<Avatar
				large
				rounded
				title="X"
				onPress={() => console.log('Works!')}
				activeOpacity={0.7}
			/>

			{this.renderSignUpButton()}
			{this.renderLogInButton()}

			<View style={styles.socialIconStyle}>
			<SocialIcon
				style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}
				title='FACEBOOK'
				button
				type='facebook'
			/>
			<SocialIcon
				style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5 }}
				title='TWITTER'
				button
				type='twitter'
			/>
			</View>

			</View>

			);
	}
	}
	
	
const styles = {
	containerStyle: {
		justifyContent: 'center', 
		alignItems: 'center',
		flex: 1
	},

	buttonStyle: { 
		marginTop: 5,
		backgroundColor: 'rgba(92, 99,216, 1)',
		width: 300,
		height: 45,
		borderColor: 'transparent',
		borderWidth: 0,
		borderRadius: 30
	},
	socialIconStyle: {
		flexDirection: 'row',
		marginTop: 30
	}
};

export default Homepage;
