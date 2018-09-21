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
import { withNavigation } from 'react-navigation';
import UserTag from '../../common/UserTag';
import firebaseApp from '../../../../../../Firebase';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

class LikesCard extends Component<Props> {

  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
    this.photo = '';
    this.userphoto = '';
    this.name = '';
    this.price = '';
    this.tagNum;
    this.allTags = [];
  }

  componentDidMount(){
    for(var i = 0; i < this.props.tags.length; i++){
      this.allTags.push(
        <UserTag name = {this.props.tags[i]}
                 key = {i} />
      );
    }
    firebaseApp.database().ref("users").child(this.props.userid).once('value').then((snap)=>{
      this.userphoto = snap.val()["userProfile"]["photo"];
    }).then(() =>{
      if(this.props.isRestaurant == true){
        firebaseApp.database().ref("Restaurants").child(this.props.restaurantid).once('value')
          .then((snap) =>{
            this.photo = snap.val()["Cover"];
            this.name = snap.val()['Name'];
            this.price = snap.val()['Price'];
            this.tagNum = snap.val()['Tags'];
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
            this.tagNum = snap.val()['Tags'];
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

  renderTags = () => {
    return(
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
        {this.allTags}
      </ScrollView
      >
    );
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
    if(this.state.loading == true){
      return(
        <View style = {[styles.menuCard, {justifyContent:'center', alignItems:'center'}]}>
          <Text>Loading...</Text>

        </View>
      );
    }
    var handleToUpdate  =   this.props.handleToUpdate;

    return (
      <View style = {styles.menuCard}>
        {this.renderImage()}
        <View style = {styles.itemDescription}>
          {this.renderName()}
          <Text>{this.price + " | " + this.tagNum + " Tags"}</Text>
          <View style = {styles.itemTags}>
            <Image source = {{uri: this.userphoto}}
                   style = {{height: _height * 0.04,
                          width: _height * 0.04, borderRadius: _height * 0.04 / 2, marginRight: 10}}
                          onPress = {() => this.props.navigation.navigate('OtherUserProfile',
                                                                  {
                                                                    id: this.props.userid
                                                                  })}/>
            {this.renderTags()}
          </View>
        </View>
      </View>
    );
  }
}


export default withNavigation(LikesCard);

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
