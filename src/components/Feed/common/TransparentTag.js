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
  TouchableOpacity
} from 'react-native';
import Tag from '../../common/Tag';
import DishImage from '../../Restaurants/RestaurantProfile/common/DishImage';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class TransparentTag extends Component<Props> {
  render() {


    return (
        <View
          style={{
            height: _height * 0.0329,
            borderRadius: 5,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'rgba(255, 255, 255, 0.9)',
            marginRight: 10
          }}>
          <Text style={{ color: "#58595B", marginHorizontal:10, textAlign:'center', fontWeight: '500'}}>{this.props.name}</Text>
        </View>
    );
  }
}
