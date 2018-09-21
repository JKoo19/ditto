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
  Dimensions,
  Image
} from "react-native";

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class WhiteTag extends Component<Props> {
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
            marginRight: 10,
            flexDirection:'row'
          }}>
          <View style = {{justifyContent:'center', alignItems:'center', marginLeft:5, marginRight:5}}>
            <Image source = {require('../../images/icons/orange_circle.png')}
                   style = {{height: _width * 0.056, width: _width * 0.056}}/>
            <Text style = {{position:'absolute', fontSize:8, color:'white'}}>{this.props.numTags}</Text>
          </View>
          <Text style={{ color: "#F52E13", marginRight:10, textAlign:'center', fontWeight: '500'}}>{this.props.name}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
