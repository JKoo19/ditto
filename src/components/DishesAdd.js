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




export default class DishesAdd extends Component<Props> {
  constructor(props){
    super(props);
    this.rootRef = firebaseApp.database().ref();

  }

databaseAdd = (category, ingredient, name, photo, price, restaurant, tags) =>{
  firebaseApp.database().ref('Dishes');
  var postData = {
    Category: category,
    Ingredient: ingredient,
    Name: name,
    Photo: photo,
    Price: price,
    Restaurant: restaurant,
    Tags: tags
  }
  var newPostKey = firebaseApp.database().ref().child('Restaurants/-LM1Kd-C5ax6Y27KHFXL/Dishes').push().key;
  var updates = {};
  updates['/Restaurants/-LM1Kd-C5ax6Y27KHFXL/Dishes/' + newPostKey] = postData;

  return firebaseApp.database().ref().update(updates);

}
//databaseAdd = (category, ingredient, name, photo, price, restaurant, tags)
  databaseAddCollection = () =>
  {
    this.databaseAdd("Spicy",
                    "etc. etc. etc. hello",
                    "Kimchi Fried Rice",
                    "",
                    "9.75",
                    "Joy Yee Noodle",
                    1);
    this.databaseAdd("Spicy",
                    "etc. etc. etc. hello",
                    "Beef Cubes",
                    "",
                    "7.30",
                    "Joy Yee Noodle",
                    30);
      this.databaseAdd("Spicy",
                      "etc. etc. etc. hello",
                      "Spicy Noodles",
                      "",
                      "10.75",
                      "Joy Yee Noodle",
                      20);
    this.databaseAdd("Dessert",
                    "goodness",
                    "Mango Smoothie",
                    "",
                    "9.75",
                    "Joy Yee Noodle",
                    1);

    this.databaseAdd("Appetizers",
                    "etc. etc. etc. hello",
                    "Kalamari",
                    "",
                    "2.75",
                    "Joy Yee Noodle",
                    30);


    this.databaseAdd("Appetizers",
                    "etc. etc. etc. hello",
                    "Dumplings",
                    "",
                    "1.75",
                    "Joy Yee Noodle",
                    5);
  }



  render() {
    return(
      <View style = {{flex:1, justifyContent:'center',alignItems:'center'}}>
        <Text>{"I'm here to help you fill your database!"}</Text>
        <Text>{"I'll help fill your dishes"}</Text>
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
