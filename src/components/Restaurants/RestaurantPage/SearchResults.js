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
  TouchableOpacity
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import SearchPage from './SearchPage'
import RestaurantCard from './common/RestaurantCard';
import WhiteBack from '../../common/WhiteBack';
import firebaseApp from '../../../../../../Firebase';
import moment from 'moment';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class SearchResults extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      searchText: this.props.navigation.getParam('search', ''),
      location:this.props.navigation.getParam('location', 'Current Location'),
      showSearch:false,
    }
    this.cards = [];
    this.rootRef = firebaseApp.database().ref();
    this.restaurantRef = this.rootRef.child('Restaurants');
    this.currLongitude;
    this.currLatitude;
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition((position) => {
      this.currLongitude = parseFloat(position.coords.longitude);
      this.currLatitude = parseFloat(position.coords.latitude);
      console.log(this.currLongitude);
      console.log("longitude^");
      
      this.restaurantRef.orderByChild('Name').startAt(this.state.searchText).
                                              endAt(this.state.searchText + "\uf8ff").
                                              once('value').then((snap) => {
          var currLongitude = this.currLongitude
          var currLatitude = this.currLatitude
          console.log(currLatitude);
          console.log('CURR LAT');
          if(snap.val() != null){
            var restaurants = snap.val();
            console.log(restaurants);
            var data = [];
            snap.forEach(function(childSnapshot) {
              data.push(childSnapshot.key);
            });
            var day = moment().format('dddd');
            console.log(data);
            for(var i = 0; i < data.length; i++){
              console.log("poop");
              var newSnap = snap.child(data[i]);

              var id = data[i];
              var name = newSnap.child('Name').val();
              var cuisine = newSnap.child('Cuisine').val();
              var price = newSnap.child('Price').val();
              var address = newSnap.child('Address').val();
              var closing = newSnap.child('Closing/' + day).val();
              var description = newSnap.child('Description').val();
              var tags = newSnap.child('Tags').val();
              var currRestLatitude = newSnap.child('Location/Latitude').val();
              var currRestLongitude = newSnap.child('Location/Longitude').val();
              console.log(this.currLongitude);
              console.log("longitude^");
              var dist = (this.calcDistance(currLatitude, currLongitude, currRestLatitude, currRestLongitude)).toFixed(2);
              this.cards.push(
              <RestaurantCard key = {i}
                              restaurantID = {id}
                              title = {name}
                              cost = {price}
                              cuisine = {cuisine}
                              tags = {tags}
                              closing ={closing}
                              distance = {dist}
                              description = {description}/>);
              }

            }
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

  renderCards = () => {
    if(this.state.searchText == ''){
      <View style = {{justifyContent:'center',
                      alignItems:'center',
                      flex:1}}>
          <Text>{"An Error Occurred"}</Text>

      </View>
    }
    if(this.state.loading == true)
    {
      return(
        <View style = {{justifyContent:'center',
                        alignItems:'center',
                        flex:1}}>
            <Text>Searching...</Text>

        </View>
      );
    }
    else{
      return(
        <View>
          {this.cards}
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
                        keyword = {this.state.searchText}
                        location = {this.state.location}/>
          </View>
        );
      }
    }



  render() {
    return (
      <View style = {styles.container}>
      <ScrollView contentContainerStyle = {styles.contentContainer}>
        <View style={styles.header}>
          <LinearGradient colors = {['#F37439', '#F26A47']} style = {styles.linearGradient}>
          <WhiteBack />
          <View style={styles.sort}>
            <Text style = {{color:'#ffffff', fontSize: 20, fontWeight:'500'}}>{"Search results"}</Text>
          </View>
          <TouchableOpacity activeOpacity = {0.8} onPress = {this.addSearch} style={styles.search}>
            <Text style = {{color:'#000000', fontSize: 12}}>{this.state.searchText}</Text>
          </TouchableOpacity>

          </LinearGradient>
        </View>
        <View style={styles.content}>
            {this.renderCards()}

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
    paddingBottom: _height * 0.105 * 2
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
    marginTop: _height * 0.023,
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
    marginTop: _height * 0.035,
    justifyContent:'center',
    flexDirection:'row',
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
  navComponentActive:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
    height: _height * 0.09,
    borderTopWidth: 2,
    borderTopColor: '#D97676',
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
