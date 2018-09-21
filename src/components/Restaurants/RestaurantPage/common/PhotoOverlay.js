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
  Text
} from "react-native";

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class PhotoOverlay extends Component<Props> {
  render() {
    return (
      <View style = {styles.container}>
        <Image source = {require('../../../../images/icons/camera.png')}
               style = {{height: _height * 0.048, width: _width * 0.093}}/>
        <Text style = {{textAlign:'center', fontSize:12, color:'white', marginHorizontal:5}}>{"See Full Menu Gallery"}</Text>

      </View>
    );
  }
}


const styles = StyleSheet.create({
  container:{
    backgroundColor:'rgba(100,100,100, 0.8)',
    position: 'absolute',
    height:_height * 0.162,
    width: _width * 0.31,
    borderRadius: 3,
    justifyContent:'center',
    alignItems:'center'
  }
});
