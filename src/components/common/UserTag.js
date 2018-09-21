/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from "react-native";

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class UserTag extends Component<Props> {
  render() {
    return (
      <View>
        <TouchableOpacity
          style={{
            height: _height * 0.0329,
            borderRadius: 5,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#F7F5F5',
            marginRight: 10
          }}>
          <Text style={{ color: "#7C7A7B", marginHorizontal:10, textAlign:'center', fontWeight: '500'}}>{this.props.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
