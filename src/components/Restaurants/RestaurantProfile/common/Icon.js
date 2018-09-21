/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  TextInput
} from 'react-native';


const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class Icon extends Component<Props> {
  render() {
    return (
      <View pointerEvents= 'box-none' style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center'}}>
        <View style = {styles.icon}>
          <Text style = {{textAlign: 'center'}}> Joy_Yee_Icon </Text>
        </View>
      </View>
    );
  }
}



const styles = StyleSheet.create({

  icon:{
    height: _height * 0.146,
    width: _height * 0.146,
    margin:'auto',
    borderRadius: (_height * 0.146)/2,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    justifyContent:'center'

  }
});
