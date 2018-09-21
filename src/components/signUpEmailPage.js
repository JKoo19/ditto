import React, { Component } from 'react';
import firebase from 'firebase';
import { Text, View } from 'react-native';
import Homepage from './Homepage';
import { Button, Card, CardSection, Input, Spinner } from './common';

class SignUpEmailPage extends Component {
	state = { 
		email: '', password: '', confirmpassword: '', error: '', loading: false, signup: false 
			};
	onButtonPress() {
		const { email, password } = this.state;
		this.setState({ error: '', loading: true });
		if (this.state.password === this.state.confirmpassword) {
			firebase.auth().createUserWithEmailAndPassword(email, password)
				.then(this.onLoginSuccess.bind(this));
		} else {
		this.setState({ error: 'Authentication Failed.', loading: false });
				}			
		}

	onLoginSuccess() {
		this.setState({
			email: '',
			password: '',
			error: '',
			loading: false,
			signup: true
		});
	}
	
	renderButton() {
		if (this.state.loading) {
			return <Spinner size="small" />;
		}
		return (
			<Button onPress={this.onButtonPress.bind(this)}>
						Submit
			</Button>
			);
	}

	render() {
		if (this.state.signup) {
			return <Homepage />;
		}
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

				<CardSection>
					<Input
					placeholder="password"
					lable="Confirm Password"
					value={this.state.confirmpassword}
					onChangeText={confirmpassword => this.setState({ confirmpassword })}
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

export default SignUpEmailPage;
