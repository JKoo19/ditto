/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
} from "react-native";

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class CardImage extends Component<Props> {
  render() {
    return (
      <View>
        <Image source = {{uri:this.props.uri}}
          style = {{height: _height * 0.162, width: _width * 0.31, borderRadius: 3, marginRight: 10}}
        />

      </View>
    );
  }
}
