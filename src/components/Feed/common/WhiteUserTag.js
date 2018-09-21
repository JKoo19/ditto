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

export default class WhiteUserTag extends Component<Props> {
  render() {
    return (
      <View>
        <TouchableOpacity
          style={{
            height: _height * 0.0329,
            borderRadius: 5,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#FFFFFF',
            marginRight: 10
          }}>
          <Text style={{ color: "#414042", marginHorizontal:10, textAlign:'center', fontWeight: '500'}}>IMC Certificate</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
