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
  TextInput
} from 'react-native';
import Tag from '../../../common/Tag';
import firebaseApp from '../../../../../../../Firebase';


const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class RestaurantProfile extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
    }
    this.currLongitude;
    this.currLatitude;
    this.currRestLatitude;
    this.currRestLongitude;
    this.distance;
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition((position) =>{
      this.currLongitude = parseFloat(position.coords.longitude);
      this.currLatitude = parseFloat(position.coords.latitude);
      firebaseApp.database().ref("Restaurants/" + this.props.restaurantid).once('value', (snap) => {
        this.currRestLatitude = snap.child('Location/Latitude').val();
        this.currRestLongitude = snap.child('Location/Longitude').val();

        var longDistance = this.calcDistance(this.currLatitude, this.currLongitude, this.currRestLatitude, this.currRestLongitude);
        this.distance = longDistance.toFixed(2);

        this.setState({loading:false});
      });
      });




  }

  calcDistance(lat1, lon1, lat2, lon2){
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    dist = dist * 1.609344
    return dist
  }



  render() {

    var handleToUpdate  =   this.props.showMap;

    return (
      <View
        pointerEvents= 'box-none'
        style = {styles.banner}>
          <View style = {styles.card}>
            <Text style = {styles.title}>{this.props.title}</Text>
            <View style = {styles.details}>
              <Text style = {styles.detailrow1}>{this.props.cost + " | "
                                                  + this.props.cuisine + " | "
                                                  + this.props.tags + " Tags"}</Text>
              <View style = {{flexDirection:'row'}}>
                <Text style = {styles.detailrow2}>{this.distance + " miles Away | "}</Text>
                <Text style = {[styles.detailrow2, {color:'#F26A47'}]} onPress = {() => handleToUpdate()}>{"Check on Maps"}</Text>
              </View>
            </View>
            <View style = {styles.paragraph}>
              <Text style = {{lineHeight: 14, fontSize: 12}}
                    numberOfLines = {4}>
                {this.props.description}
              </Text>
            </View>

            <Image source = {require('../../../../images/icons/add_tag.png')}
                   style = {{height: _height * 0.0479, width: _height * 0.0479, position: 'absolute', right: _width * 0.018, top: _height * 0.009}}/>
          </View>
        </View>
    );
  }
}



const styles = StyleSheet.create({
  banner:{
    position: 'absolute',
    top: _height * 0.241,
    backgroundColor: 'transparent',
    height: _height * 0.30
  },
  card:{
    backgroundColor: '#FFFFFF',
    height: _height * 0.259,
    marginLeft: _width * 0.058,
    marginRight: _width * 0.058,
    width: _width * 0.872,
    paddingTop: _height * 0.025,
    borderRadius: 15,
    elevation: 3
  },
  title:{
    fontSize: 20,
    fontWeight: '500',
    color: '#000000',
    textAlign:'center',
  },
  details:{
    flexDirection:'column',
    marginTop: _height * 0.0104,
    alignItems:'center',
    justifyContent:'space-between',
    height: _height * 0.045
  },
  detailrow1:{
    fontSize: 10,
    color: '#595A5C'
  },
  detailrow2:{
    fontSize:10,
    color: '#595A5C'
  },
  paragraph:{
    marginTop: _height * 0.0104,
    marginHorizontal: _width * 0.026
  },
});
