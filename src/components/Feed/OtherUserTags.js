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
import ProfileTagCard from './common/ProfileTagCard'
import WhiteUserTag from './common/WhiteUserTag'
import DishProfile from '../Restaurants/RestaurantProfile/DishProfile';
import LinearGradient from 'react-native-linear-gradient';
import MutualItemCard from './common/MutualItemCard';
import WhiteBack from '../common/WhiteBack';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class OtherUserTags extends Component<Props> {
  //THIS COMPONENT IS CURRENTLY NOT BEING USED
  constructor(props){
    super(props);

    this.state = {
      showDishView: false
    }
  }

  addView = () => {
    this.setState({
      showDishView: true
    });
  }

  removeView = () => {
    this.setState({
      showDishView: false
    });
  }

  renderView(){
      if(this.state.showDishView){
        return(
            <DishProfile handleToUpdate = {this.removeView}/>
        );
      }
    }


  render() {
    return (
    <View style = {styles.container}>
      <View style = {styles.header}>
        <LinearGradient colors = {['#F37439', '#F26A47']} style = {styles.linearGradient}>
          <View style = {{marginTop:_height * 0.05, alignItems:'center'}}>
            <Text style ={{fontSize: 20, color:'#FFFFFF', fontWeight:'600'}}>{"24 Tag Reviews in Common"}</Text>
          </View>
          <WhiteBack />
        </LinearGradient>
      </View>

     <ScrollView contentContainerStyle = {styles.contentContainer}>
        <View style = {styles.content}>
          <MutualItemCard handleToUpdate = {this.addView} dish = {"Beef Cubes"} price = {"7.30"} tagNum = {"50"}/>
          <MutualItemCard handleToUpdate = {this.addView} dish = {"Beef Cubes"} price = {"7.30"} tagNum = {"50"}/>
          <MutualItemCard handleToUpdate = {this.addView} dish = {"Beef Cubes"} price = {"7.30"} tagNum = {"50"}/>
          <MutualItemCard handleToUpdate = {this.addView} dish = {"Beef Cubes"} price = {"7.30"} tagNum = {"50"}/>
          <MutualItemCard handleToUpdate = {this.addView} dish = {"Beef Cubes"} price = {"7.30"} tagNum = {"50"}/>
          <MutualItemCard handleToUpdate = {this.addView} dish = {"Beef Cubes"} price = {"7.30"} tagNum = {"50"}/>
          <MutualItemCard handleToUpdate = {this.addView} dish = {"Beef Cubes"} price = {"7.30"} tagNum = {"50"}/>
        </View>

      </ScrollView>

      {this.renderView()}
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
  header:{
    height: _height * 0.12
  },
  linearGradient:{
    flex:1
  },
  content:{
    alignItems:'center',
    paddingTop: 20
  }
});
