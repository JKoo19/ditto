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

export default class Category extends Component<Props> {
  constructor(props){
    super(props);

    this.state = {
      isPressed:false,
      loading: true
    }
    this.dishes = [];
    this.cards = [];
    this.photolessCards = [];
    this.amount = 0;
    this.dishesRef = firebaseApp.database().ref("Restaurants/" + this.props.restaurantid + "/Dishes");
    this.add = this.props.addUpdate.bind(this);
    this.remove = this.props.removeUpdate.bind(this);
  }

  componentDidMount(){
    this.add();
    this.dishesRef.once('value', (snap) => {
      var dishes = snap.val();
      var keys = [];
      this.dishes = Object.keys(dishes);


      for(var i = 0; i < this.dishes.length; i++){
        console.log("Hey look at me");
        console.log(this.dishes[i]);
        if(snap.child(this.dishes[i] + "/Category").val() == this.props.category
            && snap.child(this.dishes[i] + "/Photo").val() != "")
        {
          this.amount = this.amount + 1;
          this.cards.push(
            <ItemCard key = {i}
                      restaurantid = {this.props.restaurantid}
                      id = {this.dishes[i]}
                      handleToUpdate = {this.props.handleToUpdate}
                      price = {snap.child(this.dishes[i] + "/Price").val()}
                      tagNum = {snap.child(this.dishes[i] + "/Tags").val()}
                      dish = {snap.child(this.dishes[i] + "/Name").val()}
                      photo = {snap.child(this.dishes[i] + "/Photo").val()}/>);
        }
      }
    });
    this.remove();
  }


  buttonPressed = () => {
    this.setState(prevState => ({
      isPressed: !prevState.isPressed}));
  }

  renderView = () =>{
      if(this.state.isPressed){
          return(
            <View style = {styles.content}>
              {this.cards}
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
              <Text style = {{fontSize:14, color:'#58595B', fontWeight:'500'}}>{this.amount}</Text>
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
