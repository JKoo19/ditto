/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Linking
} from "react-native";
import { withNavigation } from 'react-navigation';
import NumberTag from '../../../common/NumberTag';
import Tag from '../../../common/Tag';
import CardImage from './CardImage';
import PhotoOverlay from './PhotoOverlay';
import firebaseApp from '../../../../../../../Firebase';
const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

class RestaurantCard extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      loadingTags:true
    }

    this.googlemaps;

    this.currRestLatitude;
    this.currRestLongitude;

    this.restaurantTags = [];
    this.dishesRef = firebaseApp.database().ref("Restaurants/" + this.props.restaurantID +"/Dishes");
    this.photos = [];

  }

  componentDidMount(){
    firebaseApp.database().ref("Restaurants/" + this.props.restaurantID + "/Location").once('value', (snap) =>{
      this.currRestLatitude = snap.child("Latitude").val();
      this.currRestLongitude = snap.child("Longitude").val();

    })

    firebaseApp.database().ref("Restaurant_Tags").orderByChild('Restaurant_ID')
                      .equalTo(this.props.restaurantID)
                      .once('value',(snap) =>{
      var tags = [];
      var allTags = {};

      snap.forEach(function(childSnapshot) {
        tags.push(childSnapshot.val());
      });
      for(var i = 0; i < tags.length; i++){
        if(!(tags[i]["Tag"] in allTags)){
          allTags[tags[i]["Tag"]] = 1;
        }
        else{
          allTags[tags[i]["Tag"]] = allTags[tags[i]["Tag"]] + 1;
        }
      }
      var sortableArray = [];
      for (var key in allTags){
        sortableArray.push([key, allTags[key]]);
      }
      sortableArray.sort((a, b) => a[1] < b[1] ? 1 : -1);
      for(var i = 0; i < sortableArray.length; i++){
        this.restaurantTags.push(
          <NumberTag key = {i}
                    name = {sortableArray[i][0]}
                    numTags = {sortableArray[i][1]}/>
        );
      }
      this.setState({loadingTags:false})
    });

    this.dishesRef.orderByChild("Tags").once('value', (snap) =>{
      var dishes = [];
      snap.forEach(function(childSnapshot) {
        dishes.push(childSnapshot.val());

      });
      //PopularDishes just holds information to pass to items to be rendered later.
      var limit = 10
      if(dishes.length < 10){
        limit = dishes.length;
      }
      var dishesRegistered = 0;
      for(var i = 0; i < dishes.length; i++){
        if(dishesRegistered >= limit){
          break;
        }
        //popularDishCards holds the actual items to be rendered.
        if(dishes[dishes.length - 1 - i]["Photo"] == ""){
          continue;
        }
        else{
          if(dishesRegistered == 0)
          {
            dishesRegistered++;
            this.photos.push(
              <TouchableOpacity key = {i}
                                activeOpacity = {0.8}
                                onPress = {() => this.props.navigation.navigate('RestaurantProfile',
                                {
                                  id: this.props.restaurantID
                                })}>
                                <CardImage uri = {dishes[dishes.length - 1 - i]["Photo"]}/>
                                <PhotoOverlay />
              </TouchableOpacity>
                            );
          }
          else{
            dishesRegistered++;
            this.photos.push(
              <CardImage key = {i}
                         uri = {dishes[dishes.length - 1 - i]["Photo"]}/>
                            );
          }
        }
      }

    });

    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${this.currRestLatitude},${this.currRestLongitude}`;
    const label = this.props.title;
    this.googlemaps = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    this.setState({loading:false});
  }

  navigateGoogle = () =>{
    Linking.openURL(this.googlemaps);
  }



  renderTags = () => {
    if(this.state.loadingTags == true)
    {
      return(
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    else {
      if(this.restaurantTags.length == 0){
        return(
          <View>

          </View>
        );
      }
      else{
        return(
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
            {this.restaurantTags}
          </ScrollView>
        );
      }
    }
  }

  renderPhotos = () =>
  {
    if(this.photos.length != 0){
      return(
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.gallery}>
            {this.photos}
        </ScrollView>
      );
    }
    else{
      return(
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.gallery}>
            <View style = {{
              justifyContent:'center',
              alignItems:'center',
              height: _height * 0.162,
              width: _width * 0.31,
              borderRadius: 3,
              borderWidth: 1,
              borderColor:'#F26A47'
            }}>
              <Text style = {{
                textAlign:'center',
                fontSize:12,
                marginHorizontal:10,
                color:'black'
              }}>{"No photos exist from this restaurant!"}</Text>
            </View>
        </ScrollView>
      );
    }

  }

  render() {
    return (
      <View style={styles.cardContainer}>
        <View>
          <TouchableOpacity onPress = {() => this.props.navigation.navigate('RestaurantProfile',
            {
              id: this.props.restaurantID
            })}>
            <Text style={styles.title}>{this.props.title}</Text>
          </TouchableOpacity>
          <View style = {styles.details}>
            <Text style = {styles.detailrow1}>{this.props.cost + " | "
                                                + this.props.cuisine + " | "
                                                + this.props.tags + " Tags"}</Text>
            <View style = {{flexDirection:'row'}}>
              <Text style = {styles.detailrow2}>{this.props.distance + " miles Away | "}</Text>
              <Text style = {[styles.detailrow2, {color:'#F26A47'}]} onPress = {() => this.navigateGoogle()}>{"Check on Maps"}</Text>

            </View>
          </View>

          <View style = {styles.descriptionBox}>
              <Text style={styles.description}
                    numberOfLines = {4}>
                {this.props.description}
              </Text>
          </View>


            {this.renderPhotos()}

          {this.renderTags()}



        </View>
        <Image source = {require('../../../../images/icons/add_tag.png')}
               style = {{height: _height * 0.0479, width: _height * 0.0479, position: 'absolute', right: _width * 0.03, top: _width * 0.03}}/>
      </View>
    );
  }
}

export default withNavigation(RestaurantCard);

const styles = StyleSheet.create({
  cardContainer: {
    paddingLeft: _width * 0.026,
    paddingTop: _height * 0.018,
    backgroundColor: "#FFFFFF",
    elevation: 3,
    borderRadius: 5,
    width: _width * 0.88,
    height: _height * 0.457,
    marginBottom: _height * 0.043
  },
  title: {
    fontWeight: "500",
    fontSize: 19,
    color: '#000000',
    marginBottom: _height * 0.009
  },
  details: {
    flexDirection:'column',
    alignItems:'flex-start',
    justifyContent:'space-between',
    height: _height * 0.055,
    marginBottom: _height * 0.0110
  },
  detailrow1:{
    fontSize: 11,
    color: '#777777'
  },
  detailrow2:{
    fontSize: 11,
    color: '#777777'
  },
  descriptionBox:{
    height: _height * 0.058,
    marginBottom: _height * 0.015
  },
  description: {
    fontSize: 9
  },
  gallery:{
    marginBottom: _height * 0.027
  },
  tags:{
    marginBottom: _height * 0.023
  }

});
