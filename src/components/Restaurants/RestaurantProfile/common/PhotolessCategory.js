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
  Dimensions,
  TouchableOpacity
} from 'react-native';
import ItemCard from './ItemCard';
import PhotolessItemCard from './PhotolessItemCard';
import firebaseApp from '../../../../../../../Firebase';
const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class PhotolessCategory extends Component<Props> {
  constructor(props){
    super(props);

    this.state = {
      isPressed:false,
      photo:this.props.photo
    }
    this.dishes = [];
    this.photolessCards = [];
    this.dishesRef = firebaseApp.database().ref("Restaurants/" + this.props.restaurantid + "/Dishes");
  }

  componentDidMount(){
    this.dishesRef.once('value', (snap) => {
      var dishes = snap.val();
      this.dishes = Object.keys(dishes);

      var price = snap.child()

      for(var i = 0; i < this.dishes.length; i++){
        if(snap.child(this.dishes[i] + "/Category").val() == this.props.category)
        {
          console.log("Photoless");
          this.photolessCards.push(
            <PhotolessItemCard key = {i}
                      restaurantid = {this.props.restaurantid}
                      id = {this.dishes[i]}
                      handleToUpdate = {this.props.handleToUpdate}
                      price = {snap.child(this.dishes[i] + "/Price").val()}
                      tagNum = {snap.child(this.dishes[i] + "/Tags").val()}
                      dish = {snap.child(this.dishes[i] + "/Name").val()}/>);
        }
      }
    });
  }


  buttonPressed = () => {
    this.setState(prevState => ({
      isPressed: !prevState.isPressed}));
  }

  renderView = () =>{
      if(this.state.isPressed){
          return(
            <View style = {styles.content}>
              {this.photolessCards}
            </View>
          );

      }
    }



  render() {

    return (
      <View style = {styles.container}>
        <TouchableOpacity activeOpacity = {0.8} style = {styles.category}
                          onPress ={() => this.buttonPressed()}>
          <View style = {{marginLeft: _width * 0.059}}>
            <Text style = {{fontSize:14, color:'#58595B', fontWeight:'500'}}>{this.props.category}</Text>
          </View>
          <View style = {styles.number}>
            <View>
              <Text style = {{fontSize:14, color:'#58595B', fontWeight:'500'}}>{this.props.amount}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {this.renderView()}



      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    marginBottom: 5
  },
  category:{
    height: _height * 0.054,
    width: _width,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#EBEBEB'
  },
  number:{
    position:'absolute',
    justifyContent:'center',
    height: _height * 0.054,
    right: _width * 0.059
  },
  content:{
    marginTop: 20,
    alignItems:'center'
  }

});
