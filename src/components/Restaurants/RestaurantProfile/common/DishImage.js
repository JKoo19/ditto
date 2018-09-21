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

export default class DishImage extends Component<Props> {
  render() {
    return (
      <View>
        <Image source = {{uri: this.props.uri}}
          style = {{height: _height * 0.118, width: _height * 0.118}}
          />
      </View>
    );
  }
}
