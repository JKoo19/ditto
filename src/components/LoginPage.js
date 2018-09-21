import React, { Component } from 'react';
import firebase from 'firebase';
import { Text, View } from 'react-native';
import { Button, Card, CardSection, Input, Spinner } from './common';

class LoginPage extends Component {
	state = { email: '', password: '', error: '', loading: false };
	onButtonPress() {
		const { email, password } = this.state;
		this.setState({ error: '', loading: true });

		firebase.auth().signInWithEmailAndPassword(email, password)
			.then(this.onLoginSuccess.bind(this))
			.catch(() => {
						this.setState({ error: 'Authentication Failed.', loading: false });
					}
						);
					}

	onLoginSuccess() {
		this.setState({
			email: '',
			password: '',
			error: '',
			loading: false
		});
	}
	
	renderButton() {
		if (this.state.loading) {
			return <Spinner size="small" />;
		}
		return (
			<Button onPress={this.onButtonPress.bind(this)}>
						Log in
			</Button>
			);
	}

	render() {
		return (
			<View style={{ marginTop: 100 }}>
			<Card>
				<CardSection>
					<Input
					placeholder="user@gamil.com"
					lable="Email"
					value={this.state.email}
					onChangeText={email => this.setState({ email })}
					/>
				</CardSection>

				<CardSection>
					<Input
					placeholder="password"
					lable="Password"
					value={this.state.password}
					onChangeText={password => this.setState({ password })}
					secureTextEntry
					/>
				</CardSection>

				<Text style={styles.errorTextStyle}>
					{this.state.error}
				</Text>

				<CardSection>
					{this.renderButton()}
				</CardSection>
			</Card>
			</View>

			);
	}
}

const styles = {
	errorTextStyle: {
		fontSize: 20,
		alignSelf: 'center',
		color: 'red'
	}
};

export default LoginPage;
