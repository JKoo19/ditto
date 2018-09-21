import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => {
	const { TextStyle, ButtonStyle } = styles;

	return (
	<TouchableOpacity onPress={props.onPress} style={ButtonStyle}>
		<Text style={TextStyle}>
		{props.children}
		</Text>
	</TouchableOpacity>
	);
};

const styles = {
	TextStyle: {
		alignSelf: 'center',
		color: '#007aff',
		fontSize: 16,
		fontWeight: '600',
		padding: 10
	},

	ButtonStyle: {
		flex: 1,
		alignSelf: 'stretch',
		backgroundColor: '#fff',
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#007aff',
		marginLeft: 5,
		marginRight: 5
	}
};

export { Button };
