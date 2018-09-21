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

export default class HeaderImage extends Component<Props> {
  render() {
    return (
      <View style = {styles.image}>
        <Image source = {{uri:this.props.uri}}
          style = {{height: Dimensions.get("window").height * 0.37, width: Dimensions.get("window").width}}
          />
      </View>
    );
  }
}



const styles = StyleSheet.create({
  image:{
    height: _height * 0.37
  }
});
