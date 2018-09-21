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
import firebaseApp from '../../../../../../Firebase';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

class MineCard extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
    this.photo = '';
    this.userphoto = '';
    this.name = '';
    this.price = '';
    this.tagNum = 0;
    this.time = '';
  }

  componentDidMount(){
    this.time = moment(this.props.date, "YYYYMMDDHHmmss").format("MMM Do YYYY")
    firebaseApp.database().ref("Tag_Likes").orderByChild("Author").equalTo("test").once('value')
      .then((snap)=>{
        console.log(snap.val());
        var snapshot = snap.val();
        for(var key in snapshot){
          console.log(this.tagNum);
          if(snapshot[key]["Dish_ID"] == this.props.dishid
          && snapshot[key]["Restaurant_ID"] == this.props.restaurantid){
            this.tagNum++;
            console.log(this.tagNum);
          }
        }
    }).then(() =>{
      if(this.props.isRestaurant == true){
        firebaseApp.database().ref("Restaurants").child(this.props.restaurantid).once('value')
          .then((snap) =>{
            this.photo = snap.val()["Cover"];
            this.name = snap.val()['Name'];
            this.price = snap.val()['Price'];
            this.setState({loading:false});
          });
      }
      else{
        firebaseApp.database().ref("Restaurants").child(this.props.restaurantid + "/Dishes/" + this.props.dishid).once('value')
          .then((snap) =>{

            if(snap.val()["Photo"] == ''){
              this.photo = snap.val()["Placeholder"];
            }
            else{
              this.photo = snap.val()["Photo"];
            }

            this.name = snap.val()['Name'];
            this.price = "$" + snap.val()['Price'];
            this.setState({loading:false});

          });
      }
    });
  }

  renderImage = () =>{
    if(this.props.isRestaurant == true){
      return(
        <TouchableOpacity activeOpacity = {0.8} onPress ={() => this.props.navigation.navigate('RestaurantProfile',
                                                {
                                                  id: this.props.restaurantid
                                                })}>
          <DishImage uri = {this.photo}/>
        </TouchableOpacity>
      );
    }
    else{
      return(
        <TouchableOpacity activeOpacity = {0.8} onPress ={() => this.props.handleToUpdate([this.props.restaurantid, this.props.dishid])}>
          <DishImage uri = {this.photo}/>
        </TouchableOpacity>
      );
    }
  }

  renderName = () => {
    if(this.props.isRestaurant == true){
      return(
        <TouchableOpacity onPress ={() => this.props.navigation.navigate('RestaurantProfile',
                                                {
                                                  id: this.props.restaurantid
                                                })}>
          <Text style = {{fontSize: 14, fontWeight:'500', color:'#000000'}}>{this.name}</Text>
        </TouchableOpacity>
      );
    }
    else{
      return(
        <TouchableOpacity onPress = {() => this.props.handleToUpdate([this.props.restaurantid, this.props.dishid])}>
          <Text style = {{fontSize: 14, fontWeight:'500', color:'#000000'}}>{this.name}</Text>
        </TouchableOpacity>
      );
    }
  }


  render() {

    var handleToUpdate  =   this.props.handleToUpdate;
    if(this.state.loading == true){
      return(
        <View style = {[styles.menuCard, {justifyContent:'center', alignItems:'center'}]}>
          <Text>Loading...</Text>

        </View>
      );
    }
    else{
      return (
        <View style = {styles.menuCard}>
          {this.renderImage()}
          <View style = {styles.itemDescription}>
            {this.renderName()}

            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
              <Tag name = {this.props.tag} />
            </ScrollView>
            <View style = {styles.date}>
              <Text style = {{color:'#58595B', fontSize: 14, fontWeight:'500'}}>{this.time}</Text>
            </View>
            <View style = {styles.numLikes}>
              <Image source = {require('../../../images/icons/color_heart.png')}
                     style = {{height: _height * 0.025, width: _height * 0.025}}
                     resizeMode = {'stretch'}/>
              <Text style = {{color:'#58595B', fontSize: 14, fontWeight:'500', marginLeft: _width * 0.01}}>{this.tagNum}</Text>
            </View>
          </View>
        </View>
      );
    }

  }
}

export default withNavigation(MineCard);

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
  date:{
    flexDirection: 'row',
    width: _width * 0.55
  },
  numLikes:{
    position:'absolute',
    flexDirection:'row',
    justifyContent:'space-between',
    bottom: 0,
    right: _width * 0.0346
  },
  tags:{
    alignItems:'center'
  }
  });
