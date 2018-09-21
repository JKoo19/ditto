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
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import UserTag from '../../common/UserTag';
import TransparentTag from './TransparentTag';
import firebaseApp from '../../../../../../Firebase';
import moment from 'moment';
const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

class FeedCard extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      liked: false
    }
    this.likeID = '';
    this.userphoto = '';
    this.photo = '';
    this.username = '';
    this.userTags = [];
    this.tags = [];
    this.allTags = [];
    this.restaurant = '';
    this.dish = '';
    this.reason = '';
    this.description = '';
    this.time = '';
    this.price = '';
    this.dist;
    this.currRestLatitude;
    this.currRestLongitude;
  }

  componentDidMount(){
    //Need: User name, user photo, user tags

    this.time = moment(this.props.time, "YYYYMMDDHHmmss").fromNow();

    navigator.geolocation.getCurrentPosition((position) =>{
      this.currLongitude = parseFloat(position.coords.longitude);
      this.currLatitude = parseFloat(position.coords.latitude);
    });
    firebaseApp.database().ref("Tag_Likes").orderByChild("Liker").equalTo('test').once('value')
      .then((snap) =>{
        console.log(snap.val());
        var myLikes = snap.val();
        for(var key in myLikes){
          if(myLikes[key]["Author"] == this.props.userid){
            if(myLikes[key]["Restaurant_ID"] == this.props.restaurantid
              && myLikes[key]["Dish_ID"] == this.props.dishid){
                this.setState({liked:true});
                this.likeID = key;
                break;
            }
          }
        }
      }).then(() =>{
        firebaseApp.database().ref("users").child(this.props.userid).once('value').then((snap) => {
          console.log(snap.val());
          this.userphoto = snap.child('userProfile/photo').val();
          this.username = snap.child('userProfile/name').val();
          var tagSnap = snap.child('Person_Tags').val();
          var tags = [];
          for(var i = 0; i < tagSnap.length; i++){
            if(tagSnap[i]['selected'] == true)
            {
              tags.push(
                <UserTag  key = {i}
                          name = {tagSnap[i]['tag']} />
              );
            }
          }
          this.userTags = tags;



        }).then(() => {
          firebaseApp.database().ref("Restaurants").child(this.props.restaurantid).once('value').then((snap) => {
            var currRestLatitude = snap.val()['Location']['Latitude'];
            var currRestLongitude = snap.val()['Location']['Longitude'];
            var distance = this.calcDistance(this.currLatitude, this.currLongitude, currRestLatitude, currRestLongitude);
            this.dist = distance.toFixed(2);
            console.log(this.dist);
          }).then(() => {
            var promises = [];
            if(this.props.isRestaurant == true){
              var promise =firebaseApp.database().ref("Restaurants").child(this.props.restaurantid).once('value').then((snap) => {
                return snap.val();
              });
              promises.push(promise);
            }
            else{
              var promise = firebaseApp.database().ref("Restaurants").child(this.props.restaurantid + "/Dishes/" + this.props.dishid).once('value').then((snap) => {
                return snap.val();

              });
              promises.push(promise);
            }
          //Need: Rest name and/or dish name
          //
          Promise.all(promises).then((results) => {
            console.log(results);
            if(this.props.isRestaurant == true){
              this.photo = results[0]["Cover"];
              this.restaurant = results[0]["Name"];
            }
            else {
              if(results[0]["Photo"] == ''){
                this.photo = results[0]["Placeholder"];
              }
              else{
                this.photo = results[0]["Photo"];
              }
              this.dish = results[0]["Name"];
              this.price = results[0]["Price"];
              this.restaurant = results[0]["Restaurant"];
            }
          }).then(() => {
            if(this.props.isRestaurant == true){
              firebaseApp.database().ref("Restaurant_Tags").orderByChild("Author_ID").equalTo(this.props.userid).once('value')
              .then((snap) => {
                var tags = [];
                for(var key in snap.val()){
                  if(snap.val()[key]['Restaurant_ID'] == this.props.restaurantid){
                    tags.push(snap.val()[key]['Tag']);
                  }
                }
                this.allTags = tags;
                var length = tags.length;
                var random1 = Math.floor(Math.random() * length);
                if(length > 1){
                  var random2 = Math.floor(Math.random() * length);
                }
                while(random1 == random2){
                  random2 = Math.floor(Math.random() * length);
                }
                this.tags[0] = tags[random1];
                if(length > 1){
                  this.tags[1] = tags[random2];
                }
                console.log(this.username);
                this.setState({loading:false});
              });
            }
            else{
              firebaseApp.database().ref("Dish_Tags").orderByChild("Author_ID").equalTo(this.props.userid).once('value')
              .then((snap) => {
                var tags = [];
                for(var key in snap.val()){
                  if(snap.val()[key]['Restaurant_ID'] == this.props.restaurantid && snap.val()[key]['Dish_ID'] == this.props.dishid){
                    tags.push(snap.val()[key]['Tag']);
                  }
                }
                this.allTags = tags;
                var length = tags.length;
                var random1 = Math.floor(Math.random() * length);
                if(length > 1){
                  var random2 = Math.floor(Math.random() * length);
                }
                while(random1 == random2){
                  random2 = Math.floor(Math.random() * length);
                }
                this.tags[0] = tags[random1];
                if(length > 1){
                  this.tags[1] = tags[random2];
                }

                console.log(this.username);
                this.setState({loading:false});
              });
            }
          });
        });
        });
      });
}

likeAdd = () =>{
  this.setState({liked:true});
  tagObject = {};
  for(var i = 0; i < this.allTags.length; i++){
    tagObject[i] = this.allTags[i];
  }
  var postData = {
    Author: this.props.userid,
    Dish_ID: this.props.dishid,
    Liker: "test",
    Restaurant_ID: this.props.restaurantid,
    "Tags": tagObject,
    isRestaurant: this.props.isRestaurant,
    Time: moment().format("YYYYMMDDHHmmss")
  };
  var newPostKey = firebaseApp.database().ref().child('Tag_Likes').push().key;
  var updates = {};
  updates['/Tag_Likes/' + newPostKey] = postData;
  this.likeID = newPostKey;

  return firebaseApp.database().ref().update(updates, (error) => {
    if(error){
      console.log(error);
      this.setState({liked:false});
    }
    else{
      console.log("WORKED");
    }
  });
}

likeRemove = () =>{
  console.log(this.likeID);
  var updates = {};
  updates['/Tag_Likes/' + this.likeID] = null;
  firebaseApp.database().ref().update(updates, (error) =>{
    if(error){
      console.log(error);
    }
    else{
      console.log("deletion success");
      this.setState({liked:false});
    }
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

  renderUserTags = () =>{
    return(
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
        {this.userTags}
      </ScrollView>
    );
  }

  renderImage = () =>{
    if(this.props.isRestaurant == true){
      if(this.tags.length > 1){
        return(
          <TouchableOpacity activeOpacity = {0.8} onPress = {() => this.props.navigation.navigate('RestaurantProfile',
                                                  {
                                                    id: this.props.restaurantid
                                                  })}>
            <Image source = {{uri: this.photo}}
                   style = {{height: _height * 0.425, width: _width * 0.848}}
                   resizeMode = {'stretch'}/>
            <View style = {{position: 'absolute', left: _width * 0.085, top:_height * 0.072 }}>
              <TransparentTag name = {this.tags[0]} />
            </View>
            <View style = {{position: 'absolute', right: _width * 0.112, bottom:_height * 0.123 }}>
              <TransparentTag name = {this.tags[1]} />
            </View>
          </TouchableOpacity>
        );
      }
      else{
        return(
          <TouchableOpacity activeOpacity = {0.8} onPress = {() => this.props.navigation.navigate('RestaurantProfile',
                                                  {
                                                    id: this.props.restaurantid
                                                  })}>
            <Image source = {{uri: this.photo}}
                   style = {{height: _height * 0.425, width: _width * 0.848}}
                   resizeMode = {'stretch'}/>
            <View style = {{position: 'absolute', left: _width * 0.085, top:_height * 0.072 }}>
              <TransparentTag name = {this.tags[0]} />
            </View>
          </TouchableOpacity>
          );
      }
    }
    else{
      if(this.tags.length > 1){
        return(
          <TouchableOpacity activeOpacity = {0.8} onPress = {() => this.props.handleToUpdate([this.props.restaurantid, this.props.dishid])}>
             <Image source = {{uri: this.photo}}
                     style = {{height: _height * 0.425, width: _width * 0.848}}
                     resizeMode = {'stretch'}/>
             <View style = {{position: 'absolute', left: _width * 0.085, top:_height * 0.072 }}>
               <TransparentTag name = {this.tags[0]} />
             </View>
             <View style = {{position: 'absolute', right: _width * 0.112, bottom:_height * 0.123 }}>
               <TransparentTag name = {this.tags[1]} />
             </View>
          </TouchableOpacity>
        );
      }
      else{
        return(
          <TouchableOpacity activeOpacity = {0.8} onPress = {() => this.props.handleToUpdate([this.props.restaurantid, this.props.dishid])}>
             <Image source = {{uri: this.photo}}
                     style = {{height: _height * 0.425, width: _width * 0.848}}
                     resizeMode = {'stretch'}/>
             <View style = {{position: 'absolute', left: _width * 0.085, top:_height * 0.072 }}>
               <TransparentTag name = {this.tags[0]} />
             </View>
          </TouchableOpacity>
        );
      }

    }

  }

  renderDescription = () =>{
    if(this.props.isRestaurant == true){
      return(
        <View style = {styles.tagDescription}>
          <Text style = {{fontSize:12, lineHeight: 17}}>
            {"Tried "}
            <Text style = {{fontWeight:'600', color: '#F52E13', fontSize: 14}}
                  onPress = {() => this.props.navigation.navigate('RestaurantProfile',
                                                          {
                                                            id: this.props.restaurantid
                                                          })}>{this.restaurant}</Text>
            {" which is " + this.dist + " miles away from you"}
          </Text>
        </View>
      );
    }
    else{
      return(
        <View style = {styles.tagDescription}>
          <Text style = {{fontSize:12, lineHeight: 17}}>
            {"Tried "}
            <Text style = {{fontWeight:'600', color: '#F52E13', fontSize: 14}}
                  onPress = {() => this.props.handleToUpdate([this.props.restaurantid, this.props.dishid])}>{this.dish}</Text>
            {" for $" + this.price + " at "}
            <Text style = {{fontWeight:'600', color: '#F52E13', fontSize: 14}}
                  onPress = {() => this.props.navigation.navigate('RestaurantProfile',
                                                          {
                                                            id: this.props.restaurantid
                                                          })}>{this.restaurant}</Text>
            {" which is " + this.dist + " miles away from you"}
          </Text>
        </View>
      );
    }
  }

  renderHeart = () =>{
    if(this.state.liked == false){
      return(
        <TouchableOpacity style = {{position: 'absolute',
                 top: _height * 0.0225,
                 right: _width * 0.021}}
                 onPress = {() => this.likeAdd()}
                 activeOpacity = {1}>
          <Image source = {require('../../../images/icons/clear_heart.png')}
                 style = {{
                          height: _height * 0.057,
                          width: _height * 0.057}}/>
        </TouchableOpacity>
      );
    }
    else{
      return(
        <TouchableOpacity style = {{position: 'absolute',
                 top: _height * 0.0225,
                 right: _width * 0.021}}
                 onPress = {() => this.likeRemove()}
                 activeOpacity = {1}>
          <Image source = {require('../../../images/icons/color_heart.png')}
                 style = {{height: _height * 0.057,
                          width: _height * 0.057}}/>
        </TouchableOpacity>
      );
    }
  }
  renderReason = () =>{
    if(this.props.mutual == true){
      return(
        <View style = {styles.displayPurpose}>
          <Text style = {{fontSize: 10}}>{"You have tags in common with " + this.username}</Text>
        </View>
      );
    }
    else{
      return(
        <View style = {styles.displayPurpose}>
          <Text style = {{fontSize: 10}}>{"This is a recent activity"}</Text>
        </View>
      );
    }
  }

  render() {

    var handleToUpdate  =   this.props.handleToUpdate;
    if(this.state.loading == true){
      return(
        <View style = {styles.cardSurround}>
          <View style = {{height: _height * 0.66,
                          width: _width * 0.848,
                          elevation: 2,
                          backgroundColor:'#FFFFFF',
                          borderRadius: 15,
                          justifyContent:'center',
                          alignItems:'center'}}>
              <Text>{"One Moment..."}</Text>
          </View>
        </View>
      );
    }
    else{
      return (
              <View style = {styles.cardSurround}>
                <View style = {styles.card}>
                  <View style = {styles.cardHeader}>
                    <View style = {styles.profilePhoto}>
                      <TouchableOpacity activeOpacity = {0.6} onPress = {() => this.props.navigation.navigate('OtherUserProfile',
                                                              {
                                                                id: this.props.userid
                                                              })}>
                        <Image source = {{uri: this.userphoto}}
                               style = {{height: _height * 0.07, width: _height * 0.07, borderRadius: _height * 0.07 / 2}}/>
                      </TouchableOpacity>
                    </View>

                    <View style = {styles.userInfo}>
                      <TouchableOpacity style ={{flex:1}} activeOpacity = {0.6} onPress = {() => this.props.navigation.navigate('OtherUserProfile',
                                                              {
                                                                id: this.props.userid
                                                              })}>
                        <Text style = {{color:'#000000', fontSize: 16, fontWeight:'500'}}>{this.username}</Text>
                      </TouchableOpacity>
                      <View style = {styles.userTags}>
                        {this.renderUserTags()}
                      </View>
                    </View>
                    <View style = {styles.postTime}>
                      <Text style = {{fontSize:10}}>{this.time}</Text>
                    </View>

                  </View>
                  <View style = {styles.dishImage}>
                    {this.renderImage()}
                    {this.renderHeart()}

                  </View>

                  {this.renderDescription()}

                  {this.renderReason()}
                </View>
              </View>
      );
  }
  }
}

export default withNavigation(FeedCard);


const styles = StyleSheet.create({

  cardSurround:{
    height: _height * 0.7,
    alignItems:'center'
  },
  card:{
    height: _height * 0.66,
    width: _width * 0.848,
    elevation: 2,
    backgroundColor:'#FFFFFF',
    borderRadius: 15
  },
  cardHeader:{
    flexDirection:'row',
    height: _height * 0.111
  },
  profilePhoto:{
    marginLeft: _width * 0.0373,
    marginTop: _height * 0.024
  },
  userInfo:{
    flexDirection:'column',
    height: _height * 0.072,
    marginTop: _height * 0.024,
    justifyContent:'space-between',
    marginLeft: _width * 0.037
  },
  userTags:{
    flexDirection:'row',
    width: _width * 0.664
  },
  postTime:{
    position:'absolute',
    top: _height * 0.024,
    right: _width * 0.037
  },
  dishImage:{
    height: _height * 0.425,
    width: _width * 0.848
  },
  tagDescription:{
    marginLeft: _width * 0.0373,
    marginTop: _height * 0.0105,
    height: _height * 0.063,
  },
  displayPurpose:{
    marginLeft: _width * 0.0373,
    marginTop: _height * 0.02
  }
});
