/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { withNavigation } from 'react-navigation';



const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

class WhiteBack extends Component<Props> {
  render() {
    return (
      <View style = {styles.button}>
        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
          <Image source = {require('../../images/icons/navigation/white_back.png')}
                 style = {{height: _height * 0.025, width: _width * 0.06}}/>
        </TouchableOpacity>
      </View>

    );
  }
}

export default withNavigation(WhiteBack);


const styles = StyleSheet.create({
  button:{
    position:'absolute',
    top: _height * 0.047,
    left: _width * 0.055
  }
});
