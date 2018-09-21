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
  TextInput,
  TouchableOpacity
} from 'react-native';

import firebaseApp from '../../../../Firebase';
import moment from 'moment';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;




export default class RestaurantAdd extends Component<Props> {
  constructor(props){
    super(props);
    this.rootRef = firebaseApp.database().ref();

  }

databaseAdd = (address, cover, cuisine, description, latitude, longitude, name, price, tags) =>{
  var postData = {
    Address: address,
    Cover: cover,
    Cuisine: cuisine,
    Description: description,
    "Location": {Latitude: latitude, Longitude: longitude},
    Name: name,
    Price: price,
    Tags: tags
  }
  var newPostKey = firebaseApp.database().ref().child('Restaurants').push().key;
  var updates = {};
  updates['/Restaurants/' + newPostKey] = postData;

  return firebaseApp.database().ref().update(updates);

}
//databaseAdd = (category, ingredient, name, photo, price, restaurant, tags)
  databaseAddCollection = () =>
  {
    this.databaseAdd("519 Davis St",
                     "https://firebasestorage.googleapis.com/v0/b/ditto-c6bee.appspot.com/o/img%2FRestaurants%2FJoy%20Yee%20Noodle%2F348s.jpg?alt=media&token=eb446f0d-85cc-4ea4-8f7c-7049870d4141",
                     "Chinese",
                     "Joy Yee's serves a wide assortment of chinese-style dishes as well as refreshing drinks",
                     42.045973,
                     -87.678828,
                     "Joy Yeee Noodle",
                     "$$",
                     3);

  }



  render() {
    return(
      <View style = {{flex:1, justifyContent:'center',alignItems:'center'}}>
        <Text>{"I'm here to help you fill your database!"}</Text>
        <Text>{"I'll help fill your restaurants"}</Text>
        <TouchableOpacity onPress = {this.databaseAddCollection} style = {{borderWidth:1, borderColor:'#000000',
      backgroundColor:'#FFFFFF', height: 100, width: 200, justifyContent:'center',alignItems:'center'}}>
            <Text>Add</Text>
        </TouchableOpacity>
      </View>
      );
    }
  }





const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  contentContainer:{
    flexGrow:1,
    flexDirection: 'column'
  },
  back:{
    position:'absolute',
    top:30,
    left:30,
    height:20,
    width:20
  },
  content:{
    backgroundColor:'#F7F3F1',
    flex: 1
  },
  tagHolder:{
    marginTop: _height * 0.166,
    alignItems:'center',
    height: _height * 0.064,
    backgroundColor:'#EEEDED'
  },
  tags:{
    alignItems:'center'
  },
  picker:{
    marginTop: _height * 0.027,
    flexDirection:'row',
    justifyContent:'space-around',
    height: _height * 0.039
  },
  cardList:{
    alignItems:'center',
    marginTop: _height * 0.037
  }
});
