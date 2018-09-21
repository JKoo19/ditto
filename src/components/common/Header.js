// import library
import React from 'react';
import { Text, View } from 'react-native';

// create component
const Header = (props) => {
	const { textStyle, viewStyle } = styles;
  return (
	<View style={viewStyle}>
	<Text style={textStyle}>{props.headerText}</Text>
	</View>
	);
};

// Style
const styles = {
	viewStyle: {
		backgroundColor: '#F8F8F8',
		//上下位置的改变
		justifyContent: 'center',
		//水平位置的改变
		alignItems: 'center',
		height: 60,
		paddingTop: 15,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		elevation: 2,
		position: 'relative'
  }, 
  textStyle: {
		fontSize: 20
  } 
};

//registerComponent
export { Header };
