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
import ProfileTagCard from './common/ProfileTagCard';
import WhiteUserTag from './common/WhiteUserTag';
import DishProfile from '../Restaurants/RestaurantProfile/DishProfile';
import GrayBack from '../common/GrayBack';
import firebaseApp from '../../../../../Firebase';
const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class OtherUserProfile extends Component<Props> {
  constructor(props){
    super(props);

    this.state = {
      followUser: false,
      showDishView: false,
      loading: true,
    }
    this.userid = this.props.navigation.getParam('id', 'error');
    this.userphoto = '';
    this.username = '';
    this.userTags = '';
    this.cards = [];
  }

  componentDidMount(){
    firebaseApp.database().ref("users").child(this.userid).once('value').then((snap) => {
      console.log(snap.val());
      this.userphoto = snap.child('userProfile/photo').val();
      this.username = snap.child('userProfile/name').val();
      var tagSnap = snap.child('Person_Tags').val();
      var tags = [];
      for(var i = 0; i < tagSnap.length; i++){
        if(tagSnap[i]['selected'] == true)
        {
          tags.push(
            <WhiteUserTag  key = {i}
                      name = {tagSnap[i]['tag']} />
          );
        }
      }
      this.userTags = tags;

    }).then(() =>{
      var promises = [];
      var restaurantPromise = firebaseApp.database().ref("Restaurant_Tags").orderByChild("Author_ID").equalTo(this.userid)
        .once('value').then((snap) =>{
          return snap.val();
        });
      promises.push(restaurantPromise);
      var dishPromise = firebaseApp.database().ref("Dish_Tags").orderByChild("Author_ID").equalTo(this.userid)
        .once('value').then((snap) =>{
          return snap.val();
        });
        promises.push(dishPromise);

        Promise.all(promises).then((results) =>{
          if(results.length > 0){
            console.log(results);
            tagArray = [];
            for(var i = 0; i < results.length; i++){
              for(var key in results[i]){
                tagArray.push(results[i][key]);
              }
            }
            console.log(tagArray);

            tagArray.sort((a, b) => a['Date'] < b['Date'] ? 1 : -1);
            var duplicateMutualCheck = {}
            for(var i = 0; i < tagArray.length; i++){
              if("Dish_ID" in tagArray[i]){
                var id = tagArray[i]["Restaurant_ID"] + "_" + tagArray[i]["Dish_ID"];
                if(duplicateMutualCheck[id] == undefined){
                  duplicateMutualCheck[id] = 1;
                  this.cards.push(
                    <ProfileTagCard handleToUpdate = {this.addView}
                                    key = {i}
                                    userid = {this.userid}
                                    restaurantid = {tagArray[i]["Restaurant_ID"]}
                                    dishid = {tagArray[i]["Dish_ID"]}
                                    isRestaurant = {false}
                                    />
                  )
                }
                else{
                  continue;
                }

              }
              else{
                var id = tagArray[i]["Restaurant_ID"];
                if(duplicateMutualCheck[id] == undefined){
                  duplicateMutualCheck[id] = 1;
                  this.cards.push(
                    <ProfileTagCard handleToUpdate = {this.addView}
                                    key = {i}
                                    userid = {this.userid}
                                    restaurantid = {tagArray[i]["Restaurant_ID"]}
                                    dishid = {''}
                                    isRestaurant = {true}
                                    />
                                  );
                }
                else{
                  continue;
                }

              }
            }

          }
          this.setState({loading:false});
        });
    });
  }

  addView = (data) => {
    this.setState({
      //Set states here for what to pass into the dishView, and then use those states to pass props into dishView
      loadingDish:true
    });

    firebaseApp.database().ref("Restaurants/" + data[0] + "/Dishes/" + data[1]).once('value', (snap) => {
      this.dishKey = data[1];
      this.dishName = snap.child("Name").val();
      this.dishPrice = snap.child("Price").val();
      this.dishTags = snap.child("Tags").val();
      this.dishIngredients = snap.child("Ingredient").val();
      if(snap.child("Photo").val() == ""){
        this.dishImage = snap.child("Placeholder").val();
      }
      else{
        this.dishImage = snap.child("Photo").val();
      }
      this.restaurantProfile = data[0];

      this.setState({
        loadingDish:false,
        showDishView: true,
      });
    });
  }

  removeView = () => {
    this.setState({
      showDishView: false
    });
  }

  addDishProfile = () => {
    this.setState({
      loadingDish: true
    });
  }

  removeDishProfile = () => {
    this.setState({
      loadingDish: false
    });
  }

  renderView = () =>{
      if(this.state.showDishView){
        return(
          <DishProfile  restaurantid = {this.restaurantProfile}
                        dishid = {this.dishKey}
                        name = {this.dishName}
                        price = {this.dishPrice}
                        tagNum = {this.dishTags}
                        uri = {this.dishImage}
                        ingredients = {this.dishIngredients}
                        loading = {this.state.loadingDish}
                        addUpdate = {this.addDishProfile}
                        removeUpdate = {this.removeDishProfile}
                        handleToUpdate = {this.removeView}/>
        );
      }
    }

    renderUserTags = () =>{
      return(
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
          {this.userTags}
        </ScrollView>
      );
    }

    renderCards = () => {
      console.log(this.cards);
      return(
        <View style = {styles.content}>
          {this.cards}
        </View>
      );
    }


  renderFollow =() =>{
    if(!this.state.followUser)
    {
      return(<View style = {styles.follow}>
            <Text style = {{color:'#F52E13', fontSize:12}}>Follow</Text>
            </View>)
    }
    else{
      return(<View style = {styles.noFollow}>
            <Text style = {{color:'#FFFFFF', fontSize:12}}>Follow</Text>
            </View>)
    }
  }


  render() {
    if(this.state.loading == true){
      return(
        <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
          <Text>Loading...</Text>
        </View>
      );
    }
    else{
      return (
      <View style = {styles.container}>
        <ScrollView contentContainerStyle = {styles.contentContainer}>

          <View style = {styles.header}>
            <View style = {styles.profilePhoto}>
              <Image source = {{uri: this.userphoto}}
                     style = {{height: _height * 0.09, width: _height * 0.09, borderRadius: _height * 0.09 / 2}}/>
            </View>
            <View style = {styles.name}>
              <Text style = {{fontSize: 18, fontWeight:'600', color:'#000000'}}>{this.username}</Text>
            </View>
            <GrayBack />
          </View>

          <View style = {styles.userTags}>
            {this.renderUserTags()}
          </View>


          <View style = {{marginTop:_height * 0.03, marginLeft: _width * 0.045}}>
            <Text style = {{color:'#6D6E71',fontWeight:'600', fontSize: 16 }}>{this.username + "'s recent tags"}</Text>
          </View>

          {this.renderCards()}


        </ScrollView>

        {this.renderView()}

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
  header:{
    height: _height * 0.26,
    alignItems:'center',
    backgroundColor:'#FFFFFF'
  },
  profilePhoto:{
    marginTop: _height * 0.08,
    marginBottom: _height * 0.012
  },
  description:{
    marginTop: _height * 0.005
  },
  back:{
    position:'absolute',
    top: _height * 0.047,
    left: _width * 0.055
  },
  follow:{
    position:'absolute',
    height: _height * 0.03,
    width: _width * 0.186,
    borderRadius:5,
    borderWidth:1,
    borderColor:'#F52E13',
    right:_width * 0.06,
    top: _height * 0.058,
    justifyContent:'center',
    alignItems:'center'
  },
  noFollow:{
    position:'absolute',
    height: _height * 0.03,
    width: _width * 0.186,
    borderRadius:5,
    backgroundColor:'#F52E13',
    right:_width * 0.06,
    top: _height * 0.058,
    justifyContent:'center',
    alignItems:'center'
  },
  facebook:{
    position:'absolute',
    height: _height * 0.039,
    width: _height * 0.039,
    bottom: _height * 0.018,
    right:_width * 0.12,
    borderRadius: _height * 0.039/2,
    backgroundColor:'#4E598F',
    justifyContent:'center',
    alignItems:'center'
  },
  userTags:{
    height: _height * 0.064,
    backgroundColor:'#F5F7FA',
    alignItems:'center'

  },
  tags:{
    alignItems:'center',
    paddingLeft:10
  },
  gallerycontainer:{
    alignItems:'center',
    marginTop:_height * 0.032
  },
  gallery:{
    height: _height * 0.24,
    width: _width * 0.85,
    borderRadius: 5
  },
  cover:{
    position:'absolute',
    top: 0,
    backgroundColor:'rgba(80, 80, 80, 0.6)',
    height: _height * 0.24,
    width: _width * 0.85,
    borderRadius: 5,
    alignItems:'center',
    justifyContent:'center'
  },
  content:{
    marginTop: _height * 0.04,
    alignItems:'center'
  }
});
