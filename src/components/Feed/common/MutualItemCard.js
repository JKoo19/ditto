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

export default class MutualItemCard extends Component<Props> {
  render() {

    var handleToUpdate  =   this.props.handleToUpdate;

    return (
      <View style = {styles.menuCard}>
        <TouchableOpacity activeOpacity = {0.8} onPress ={() => handleToUpdate()}>
          <DishImage uri = {require('../../../images/Joy_Yee_Noodle/Profile/photo10.jpg')}/>
        </TouchableOpacity>
        <View style = {styles.itemDescription}>
          <TouchableOpacity onPress ={() => handleToUpdate()}>
            <Text style = {{fontSize: 14, fontWeight:'500', color:'#000000'}}>{this.props.dish}</Text>
          </TouchableOpacity>
          <Text>{"$" + this.props.price + " | " + this.props.tagNum + " Tags"}</Text>
          <View style = {styles.itemTags}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}



const styles = StyleSheet.create({

  menuCard:{
    flexDirection:'row',
    height: _height * 0.16,
    width: _width * 0.853,
    borderRadius: 6,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    paddingLeft: _width * 0.0346,
    paddingTop: _height * 0.0225,
    paddingBottom: _height * 0.0165,
    marginBottom: 20
  },
  itemDescription:{
    marginLeft: _width * 0.0426,
    flexDirection: 'column',
    justifyContent:'space-between'
  },
  itemTags:{
    flexDirection: 'row',
    width: _width * 0.55
  }
  });
