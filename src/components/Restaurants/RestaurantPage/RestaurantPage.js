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
  TextInput,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import SearchPage from './SearchPage'
import RestaurantCard from './common/RestaurantCard';
import firebaseApp from '../../../../../../Firebase';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class RestaurantPage extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      showSearch:false,
      loading:true,
      nearby: true,
      loadingContent: false
    }
    this.rootRef = firebaseApp.database().ref();
    this.Ref = firebaseApp.database().ref("Restaurants");

    this.nearbyKeys = [],
    this.nearbyCards = [];
    this.popularCards = [];

    this.distances = [];
    this.currLongitude;
    this.currLatitude;
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition((position) =>{
      this.currLongitude = parseFloat(position.coords.longitude);
      this.currLatitude = parseFloat(position.coords.latitude);

      this.Ref.orderByChild('Tags').once('value', (snap) =>{
        var popularRestaurants = [];
        var keys = [];
        snap.forEach(function(childSnapshot) {
          popularRestaurants.push(childSnapshot.val());
          keys.push(childSnapshot.key);
        });
        console.log(popularRestaurants);
        console.log(popularRestaurants.length);
        console.log("helloooo");

        for(var i = 0; i < popularRestaurants.length; i++){
          console.log(popularRestaurants[i]['Location']['Latitude']);
          var currRestLatitude = popularRestaurants[popularRestaurants.length - 1 - i]['Location']['Latitude'];
          var currRestLongitude = popularRestaurants[popularRestaurants.length - 1 - i]['Location']['Longitude'];
          var dist = this.calcDistance(this.currLatitude, this.currLongitude, currRestLatitude, currRestLongitude);
          var shortenedDist = dist.toFixed(2)
          this.popularCards.push(
            <RestaurantCard key = {i}
                      restaurantID = {keys[popularRestaurants.length - 1 - i]}
                      title = {popularRestaurants[popularRestaurants.length - 1 - i]["Name"]}
                      cost = {popularRestaurants[popularRestaurants.length - 1 - i]["Price"]}
                      cuisine = {popularRestaurants[popularRestaurants.length - 1 - i]["Cuisine"]}
                      tags = {popularRestaurants[popularRestaurants.length - 1 - i]["Tags"]}
                      distance = {shortenedDist}
                      description = {popularRestaurants[popularRestaurants.length - 1 - i]["Description"]}/>
          );
        }


      });
      //make nearby dish cards array
      this.Ref.on('value', (snap) => {
        var restaurants = snap.val();
        this.nearbyKeys = Object.keys(restaurants);
        var day = moment().format('dddd');
        console.log(restaurants);
        console.log(this.nearbyKeys);
        for(var i = 0; i < this.nearbyKeys.length; i++){
          var currSnap = snap.child(this.nearbyKeys[i]);
          var currSnapLatitude = currSnap.child('Location/Latitude').val();
          var currSnapLongitude = currSnap.child('Location/Longitude').val();
          var dist = this.calcDistance(this.currLatitude, this.currLongitude, currSnapLatitude, currSnapLongitude);
          console.log(this.currLatitude);
          console.log(this.currLongitude);
          console.log(dist);
          var object = {distance: dist, key: this.nearbyKeys[i]};
          this.distances.push(object);

        }
        console.log(this.distances);
        var sortedDistances = [].concat(this.distances)
                .sort((a, b) => a['distance'] > b['distance'] ? 1 : -1);

        for(var i = 0; i < sortedDistances.length; i++){
          var newSnap = snap.child(sortedDistances[i]['key']);

          var id = sortedDistances[i]['key'];
          var name = newSnap.child('Name').val();
          var cuisine = newSnap.child('Cuisine').val();
          var price = newSnap.child('Price').val();
          var address = newSnap.child('Address').val();
          var distance = (sortedDistances[i]['distance']).toFixed(2);
          var closing = newSnap.child('Closing/' + day).val();
          var description = newSnap.child('Description').val();
          var tags = newSnap.child('Tags').val();
          this.nearbyCards.push(
          <RestaurantCard key = {i}
                          restaurantID = {id}
                          title = {name}
                          cost = {price}
                          cuisine = {cuisine}
                          tags = {tags}
                          distance = {distance}
                          description = {description}/>);
        }
        this.setState({loading:false});
      });
    });

    //make popular dish cards array

  }


  componentWillUnmount(){
    this.Ref.off();
  }


  componentDidUpdate(prevProps, prevState){
    if(this.state.loadingContent != prevState.loadingContent){
      if(this.state.loadingContent == true)
      {
        this.setState({loadingContent: false});
      }
    }
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

  renderContent = () =>{
    if(this.state.loadingContent == true)
    {
      return(
        <View style = {{flex: 1, justifyContent:'center',alignItems:'center'}}>
          <Text>Loading...</Text>
        </View>
      );
    }
    else{
      if(this.state.nearby == true)
      {
        return(
          <View>
            {this.nearbyCards}
          </View>
        );
      }
      else{
        return(
          <View>
            {this.popularCards}
          </View>
        );
      }
    }
  }

  selectNearby = () =>{
    this.setState({nearby:true, loadingContent:true});
  }

  selectPopular = () =>{
    this.setState({nearby:false,loadingContent:true});
  }

  renderSorter = () =>{
    if(this.state.nearby == true){
      return(
        <View style={styles.sort}>
          <View style = {[styles.nearby, {borderBottomWidth:1, borderBottomColor:'white'}]}>
            <Text  style = {{fontSize: 15, color:'#FFFFFF'}}>Nearby</Text>
          </View>
          <View style = {styles.popular}>
            <Text onPress = {this.selectPopular} style = {{fontSize: 15, color:'#FFFFFF'}}>Popular</Text>
          </View>
        </View>
      );
    }
    else{
      return(
        <View style={styles.sort}>
          <View style = {styles.nearby}>
            <Text onPress = {this.selectNearby} style = {{fontSize: 15, color:'#FFFFFF'}}>Nearby</Text>
          </View>
          <View style = {[styles.popular, {borderBottomWidth:1, borderBottomColor:'white'}]}>
            <Text  style = {{fontSize: 15, color:'#FFFFFF'}}>Popular</Text>
          </View>
        </View>
      );
    }
  }


  addSearch = () =>{
    this.setState({
      showSearch:true
    });
  }

  closeSearch = () => {
    this.setState({
      showSearch:false
    });
  }

  showSearch(){
      if(this.state.showSearch){
        return(
          <View style = {{position:'absolute'}}>
            <SearchPage handleToUpdate = {this.closeSearch}
                        keyword = {""}
                        location = {"Current Location"}/>
          </View>
        );
      }
    }



  render() {
    if(this.state.loading == true){
      return(
        <View style = {{flex:1, backgroundColor:'#FFFFFF', justifyContent:'center',alignItems:'center'}}>
          <Text style = {{opacity: 0.4}}>{"One moment..."}</Text>
        </View>
      );
    }
    else{
      console.log(this.state.nearby);
      return (
        <View style = {styles.container}>
        <ScrollView contentContainerStyle = {styles.contentContainer}>
          <View style={styles.header}>
            <LinearGradient colors = {['#F37439', '#F26A47']} style = {styles.linearGradient}>
            <TouchableOpacity activeOpacity = {0.8} onPress = {this.addSearch} style={styles.search}>
              <Text style = {{color:'#000000', fontSize: 12}}>{"Search for Restaurants"}</Text>
            </TouchableOpacity>

            {this.renderSorter()}

            </LinearGradient>
          </View>
          <View style={styles.content}>
              {this.renderContent()}
          </View>
        </ScrollView>

        <View style = {styles.navBar}>
          <View style = {styles.innerBar}>
            <TouchableOpacity style ={{flex:1}} activeOpacity = {0.8} onPress = {() => this.props.navigation.navigate('Feed')}>
              <View style = {styles.navComponent}>
                  <Image source = {require('../../../images/icons/navigation/inactive/Feed_Inactive.png')}
                      style = {{width: _height * 0.036, height: _height * 0.036 }}/>
                  <Text style = {{fontSize: 14}}>Feed</Text>
              </View>
            </TouchableOpacity>
            <View style = {styles.navComponent}>
              <Image source = {require('../../../images/icons/navigation/active/Search_Active.png')}
                      style = {{width: _height * 0.036, height: _height * 0.036 }}/>
              <Text style = {{fontSize: 14, color:'#F52E13'}}>Discover</Text>
            </View>
          </View>
        </View>

        {this.showSearch()}
      </View>
      );
    }
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
  content:{
    alignItems:'center',
    backgroundColor:'#F7F3F1',
    flex: 1,
    paddingTop: _height * 0.042,
    paddingBottom: _height * 0.09
  },
  header: {
    backgroundColor: '#F36B45',
    height: _height * 0.18

  },
  linearGradient:
  {
    flex: 1
  },
  search:{
    marginTop: _height * 0.043,
    height: _height * 0.059,
    marginHorizontal: _width * 0.141,
    borderRadius: 5,
    elevation: 2,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'rgb(255,255,255)'
  },
  sort:{
    height: _height * 0.0374,
    marginTop: _height * 0.028,
    justifyContent:'center',
    flexDirection:'row',
  },
  nearby:{
    marginRight: _width * 0.064
  },
  popular:{
    marginLeft: _width * 0.064

  },
  navBar:{
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFFFFF',
    height: _height * 0.09,
    width: _width,
    elevation: 10
  },
  innerBar:{
    flexDirection: 'row',
    flex:1,
    height: _height * 0.09,
    justifyContent:'space-between',
    alignItems:'center',
    marginHorizontal: _width * 0.04
  },
  navComponent:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    height: _height * 0.09
  },
  map:{
    position: 'absolute',
    justifyContent:'center',
    alignItems:'center',
    elevation: 3,
    backgroundColor:'#FFFFFF',
    bottom: _height * 0.117,
    right: _width * 0.016,
    height: _height * 0.105,
    width: _height * 0.105,
    borderRadius: _height * 0.105 / 2
  }


});
