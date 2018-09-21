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

import FeedCard from './common/FeedCard';
import DishProfile from '../Restaurants/RestaurantProfile/DishProfile';
import firebaseApp from '../../../../../Firebase';
import moment from 'moment';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class Feed extends Component<Props> {
  constructor(props){
    super(props);

    this.state = {
      displayCards: [],
      showDishView: false,
      loadingDish: false,
      loading: true,
      empty:false
    }
    this.tester
    this.uniqueRestaurantsArray = [];
    this.uniqueDishesArray = [];
    this.mutualUsersRestaurant = [];
    this.mutualUsersDish = [];
    this.allMutualUsers = [];
    this.mutualCards = [];
    this.mutualDuplicateChecker = {};
    this.recentCards =[];
    this.restaurantProfile = '';

    this.dishKey = '';
    this.dishName = '';
    this.dishPrice = '';
    this.dishTags = '';
    this.dishIngredients = '';
    this.dishImage = '';
    this.restaurantProfile = '';
  }
/*
  componentDidMount(){

    firebaseApp.database().ref("Restaurant_Tags").orderByChild("Author_ID")
                          .equalTo("test").once('value').then((snap) =>{
              this.tester = snap.val();
              this.setState({loading:false});

  });
}
*/


  componentDidMount(){


    firebaseApp.database().ref("Restaurant_Tags").orderByChild("Author_ID")
                          .equalTo("test").once('value').then((snap) =>{
          if(snap.val() != null){
            //Get array of restaurants user has tagged
            firebaseApp.database().ref("Restaurant_Tags").orderByChild("Author_ID")
                                  .equalTo("test").once('value').then((snap) => {

                if(snap.val() != null){
                  var queryObject = snap.val();
                  var tagKeys = Object.keys(queryObject);
                  var uniqueRestaurants = {};
                  for(var i = 0; i < tagKeys.length; i++){
                    if(!(queryObject[tagKeys[i]]["Restaurant_ID"] in uniqueRestaurants)){
                      uniqueRestaurants[queryObject[tagKeys[i]]["Restaurant_ID"]] = 1;
                    }
                  }
                  var uniqueRestaurantsArray = [];
                  for(var key in uniqueRestaurants){
                    uniqueRestaurantsArray.push(key);
                  }

                  //finding users with same restaurant tags
                  var mutualUsersRestaurant = [];
                  for(var i = 0; i < uniqueRestaurantsArray.length; i++){
                    var index = i;
                    firebaseApp.database().ref("Restaurant_Tags").orderByChild("Restaurant_ID")
                                          .equalTo(uniqueRestaurantsArray[index])
                                          .once('value', (snap) =>{
                            var queryObject2 = snap.val();
                            var keys = Object.keys(queryObject2);
                            var foundUsers = {};
                            for(var j = 0; j < keys.length; j++){
                              if(queryObject2[keys[j]]["Author_ID"] == "test"){
                                continue;
                              }
                              else{
                                if(!(queryObject2[keys[j]]["Author_ID"] in foundUsers)){
                                  foundUsers[queryObject2[keys[j]]["Author_ID"]] = 1;
                                }
                              }
                            }
                            for(var key in foundUsers){
                              mutualUsersRestaurant.push(key);
                            }
                            if(index == uniqueRestaurantsArray.length - 1){
                              this.mutualUsersRestaurant = mutualUsersRestaurant.slice(0);
                              return mutualUsersRestaurant;
                            }
                    });
                  }
                }
            }).then((mutualUsers) => {
              firebaseApp.database().ref("Dish_Tags").orderByChild("Author_ID")
                                    .equalTo("test").once('value').then((snap) => {

                if(snap.val() != null){
                  var queryObject = snap.val();
                  var tagKeys = Object.keys(queryObject);
                  var uniqueDishes = {};
                  for(var i = 0; i < tagKeys.length; i++){
                    if(!(queryObject[tagKeys[i]]["Dish_ID"] in uniqueDishes)){
                      uniqueDishes[queryObject[tagKeys[i]]["Dish_ID"]] = queryObject[tagKeys[i]]["Restaurant_ID"]; //Object with key:value = dish_id:restaurant_id
                    }
                  }
                  var dishesArray =[];
                  for(var key in uniqueDishes){
                    dishesArray.push([key, uniqueDishes[key]]);
                  }
                  //finding users with same dish tags
                  var promises = [];
                  for(var i = 0; i < dishesArray.length; i++){
                    var index = i;
                    var restaurantID = dishesArray[i][1];
                    var userPromise = firebaseApp.database().ref("Dish_Tags").orderByChild("Dish_ID")
                                          .equalTo(dishesArray[index][0])
                                          .once('value').then((snap) => {
                            return snap.val();
                    });
                    promises.push(userPromise);

                  }
                }
                else{
                  var promises = [];
                }
                    Promise.all(promises).then((results) => {
                      if(results.length > 0){
                      var foundUsers = {};
                      var mutualUsers = [];
                      for(var i = 0; i < results.length; i++){

                        var keys = Object.keys(results[i]);

                        for(var j = 0; j < keys.length; j++){
                          if(results[i][keys[j]]["Author_ID"] == "test"){
                            continue;
                          }
                          else{
                            if(results[i][keys[j]]["Restaurant_ID"] == restaurantID);
                            {
                              if(!(results[i][keys[j]]["Author_ID"] in foundUsers)){
                                foundUsers[results[i][keys[j]]["Author_ID"]] = 1;
                              }
                            }
                          }
                        }
                        for(var key in foundUsers){
                          mutualUsers.push(key);
                        }
                      }


                        this.mutualUsersDish = mutualUsers.slice(0);
                        //return mutualUsers;
                        this.allMutualUsers = this.mutualUsersDish.concat(this.mutualUsersRestaurant);
                        var retArray = this.allMutualUsers.slice(0);
                        return retArray;
                      }
                      else{
                        retArray = [];
                        return retArray;
                      }
                    }).then((userList) => {    //Promise.all()1 end
                      if(userList.length > 0){
                        var uniqueUsers = {};
                        var uniqueUserList = [];
                        for(var i = 0; i < userList.length; i++){
                          if(!(userList[i] in uniqueUsers)){
                            uniqueUsers[userList[i]] = 1;
                          }
                        }
                        for(var key in uniqueUsers){
                          uniqueUserList.push(key);
                        }

                        //With list of users, make an array of objects this contain ALL the information necessary to make a feed card. Then sort the array based on times
                        //Then can make the cards into a list of cards to render. (Can later append the 10 most recent cards) (Can use conditional push to check for duplicates)

                        //Restaurant Tags
                        var restaurantPromises = [];
                        for(var i = 0; i < uniqueUserList.length; i++){
                          var tagPromise = firebaseApp.database().ref("Restaurant_Tags").orderByChild('Author_ID').equalTo(uniqueUserList[i])
                                  .once('value').then((snapshot) => {
                                    return snapshot.val();
                                  });
                          restaurantPromises.push(tagPromise);
                        }
                        var dishPromises = [];
                        for(var i = 0; i < uniqueUserList.length; i++){
                          var tagPromise = firebaseApp.database().ref("Dish_Tags").orderByChild('Author_ID').equalTo(uniqueUserList[i])
                                  .once('value').then((snapshot) => {
                                    return snapshot.val();
                                  });
                          dishPromises.push(tagPromise);
                        }
                      var allPromises = restaurantPromises.concat(dishPromises);
                      }
                      else{
                        var allPromises = [];
                      }
                      Promise.all(allPromises).then((results) => {
                        if(results.length > 0){
                        results.reverse();
                        var tagInformation = [];
                        var tempMutualChecker = {};
                        //go thru each array to get each object. Then, for each object, go through each key
                        //have to make sure no duplicate objects of tagging are shown for same user.
                        //i.e. if user tags same dish twice, should only appear once.
                        for(var i = 0; i < results.length; i++){
                          //Make an object here to keep track of what tags user has made and to remove duplicates by keeping track of earliest tag for a specific item
                          var latestTimes = {};
                          for(var key in results[i]){
                            var thisTime = results[i][key]["Date"];
                            if("Dish_ID" in results[i][key]){
                              var id = results[i][key]["Restaurant_ID"] + "_" + results[i][key]["Dish_ID"];
                              if(!(id in latestTimes)){
                                latestTimes[id] = thisTime;
                              }
                              else{
                                if(thisTime > latestTimes[id])
                                {
                                  latestTimes[id] = thisTime;
                                }
                              }
                            }
                            else{
                              var id = results[i][key]["Restaurant_ID"];
                              if(!(id in latestTimes)){
                                latestTimes[id] = thisTime;
                              }
                              else{
                                if(thisTime > latestTimes[id])
                                {
                                  latestTimes[id] = thisTime;
                                }
                              }
                            }
                          }

                          //Same loop to check for duplicates
                          var duplicateCheck = {};
                          for(var key in results[i]){
                            if("Dish_ID" in results[i][key]){
                              var id = results[i][key]["Restaurant_ID"] + "_" + results[i][key]["Dish_ID"];
                              if(!(id in duplicateCheck)){
                                duplicateCheck[id] = 1;
                                if(tempMutualChecker[results[i][key]["Author_ID"]] == undefined){
                                  tempMutualChecker[results[i][key]["Author_ID"]] = {};
                                }
                                tempMutualChecker[results[i][key]["Author_ID"]][id] = 1;

                              }
                              else{
                                continue;
                              }
                            }
                            else{
                              var id = results[i][key]["Restaurant_ID"];
                              if(!(id in duplicateCheck)){
                                duplicateCheck[id] = 1;
                                if(tempMutualChecker[results[i][key]["Author_ID"]] == undefined){
                                  tempMutualChecker[results[i][key]["Author_ID"]] = {};
                                }
                                tempMutualChecker[results[i][key]["Author_ID"]][id] = 1;
                              }
                              else{
                                continue;
                              }
                            }

                            //Pushing final tag info
                            //Need: Time(for sorting), Mutual(bool(to show why card is being shown)), Dish_ID(If applicable), Restaurant_ID, Author_ID, isRestaurant
                            if("Dish_ID" in results[i][key]){
                              var tagObject = {
                                Time: latestTimes[results[i][key]["Restaurant_ID"] + "_" + results[i][key]["Dish_ID"]],
                                Dish: results[i][key]["Dish_ID"],
                                Restaurant: results[i][key]["Restaurant_ID"],
                                isRestaurant: false,
                                Author: results[i][key]["Author_ID"]
                              };
                              tagInformation.push(tagObject);
                            }
                            else{
                              var tagObject = {
                                Time: latestTimes[results[i][key]["Restaurant_ID"]],
                                Restaurant: results[i][key]["Restaurant_ID"],
                                isRestaurant: true,
                                Dish: "",
                                Author: results[i][key]["Author_ID"]
                              };
                              tagInformation.push(tagObject);
                            }
                          }
                        } //End of outer for loop
                        this.mutualDuplicateChecker = tempMutualChecker;
                        console.log(tagInformation);

                        //If we sort by time, and then take out duplicates, it should work?
                        tagInformation.sort((a, b) => a['Time'] < b['Time'] ? 1 : -1);


                        //For Loop to push feed Cards from Mutual
                        var tempArray = [];
                        for(var i = 0; i < tagInformation.length; i++){
                            tempArray.push(
                              <FeedCard key = {i}
                                        handleToUpdate = {this.addView}
                                        mutual = {true}
                                        time = {tagInformation[i]["Time"]}
                                        restaurantid = {tagInformation[i]["Restaurant"]}
                                        isRestaurant = {tagInformation[i]["isRestaurant"]}
                                        dishid = {tagInformation[i]["Dish"]}
                                        userid = {tagInformation[i]["Author"]}/>
                            );
                        }
                        this.mutualCards = tempArray;
                        console.log(this.mutualCards);

                      }
                    }).then(() => { //This is for adding on the recent
                        var promises = [];
                        var restaurantPromise = firebaseApp.database().ref("Restaurant_Tags").orderByChild("Date").limitToLast(10)
                        .once('value').then((snap) => {
                          return snap.val();
                        });
                        promises.push(restaurantPromise);
                        var dishPromise = firebaseApp.database().ref("Dish_Tags").orderByChild("Date").limitToLast(10)
                        .once('value').then((snap) => {
                          return snap.val();
                        });
                        promises.push(dishPromise);
                        Promise.all(promises).then((results) => {
                          if(results.length > 0){
                            var duplicateMutualCheck = this.mutualDuplicateChecker;
                            var tagInfo = [];
                            for(var i = 0; i < results.length; i++){
                              var duplicateCheck = {};
                              for(var key in results[i]){
                                if(results[i][key]["Author_ID"] == "test"){
                                  continue;
                                }
                                if("Dish_ID" in results[i][key]){
                                  var id = results[i][key]["Restaurant_ID"] + "_" + results[i][key]["Dish_ID"];
                                  if(duplicateMutualCheck[results[i][key]["Author_ID"]] == undefined){
                                    duplicateMutualCheck[results[i][key]["Author_ID"]] = {};
                                    duplicateMutualCheck[results[i][key]["Author_ID"]][id] = 1;
                                  }
                                  else{
                                    if(duplicateMutualCheck[results[i][key]["Author_ID"]][id] == undefined)
                                    {
                                      duplicateMutualCheck[results[i][key]["Author_ID"]][id] = 1;
                                    }
                                    else{
                                      continue;
                                    }
                                  }
                              }
                                else{
                                  var id = results[i][key]["Restaurant_ID"];
                                  if(duplicateMutualCheck[results[i][key]["Author_ID"]] == undefined){
                                    duplicateMutualCheck[results[i][key]["Author_ID"]] = {};
                                    duplicateMutualCheck[results[i][key]["Author_ID"]][id] = 1;
                                  }
                                  else{
                                    if(duplicateMutualCheck[results[i][key]["Author_ID"]][id] == undefined)
                                    {
                                      duplicateMutualCheck[results[i][key]["Author_ID"]][id] = 1;
                                    }
                                    else{
                                      continue;
                                    }
                                  }
                              }

                                //Pushing final tag info
                                //Need: Time(for sorting), Mutual(bool(to show why card is being shown)), Dish_ID(If applicable), Restaurant_ID, Author_ID, isRestaurant
                                if("Dish_ID" in results[i][key]){
                                  var tagObject = {
                                    Time: results[i][key]["Date"],
                                    Dish: results[i][key]["Dish_ID"],
                                    Restaurant: results[i][key]["Restaurant_ID"],
                                    isRestaurant: false,
                                    Author: results[i][key]["Author_ID"]
                                  };
                                  tagInfo.push(tagObject);
                                }
                                else{
                                  var tagObject = {
                                    Time: results[i][key]["Date"],
                                    Restaurant: results[i][key]["Restaurant_ID"],
                                    isRestaurant: true,
                                    Dish: "",
                                    Author: results[i][key]["Author_ID"]
                                  };
                                  tagInfo.push(tagObject);
                                }
                              }
                            } //End of outer for loop
                            tempArray = [];
                            for(var i = 0; i < tagInfo.length; i++){
                              tempArray.push(
                                <FeedCard key = {(i + 1) * -1}
                                          handleToUpdate = {this.addView}
                                          mutual = {false}
                                          time = {tagInfo[i]["Time"]}
                                          restaurantid = {tagInfo[i]["Restaurant"]}
                                          isRestaurant = {tagInfo[i]["isRestaurant"]}
                                          dishid = {tagInfo[i]["Dish"]}
                                          userid = {tagInfo[i]["Author"]}/>
                              );
                            }
                            this.recentCards = tempArray;
                        }
                          var combinedArray = this.recentCards.concat(this.mutualCards);
                          this.setState({loading:false, displayCards: combinedArray});
                        }); //End of promise.all
                      }); //End of retrieving recent 10
                    });
                });
              });
          }
          else{ //Just do 10 most recent


            var promises = [];
            var restaurantPromise = firebaseApp.database().ref("Restaurant_Tags").orderByChild("Date").limitToLast(10)
            .once('value').then((snap) => {
              return snap.val();
            });
            promises.push(restaurantPromise);
            var dishPromise = firebaseApp.database().ref("Dish_Tags").orderByChild("Date").limitToLast(10)
            .once('value').then((snap) => {
              return snap.val();
            });
            promises.push(dishPromise);
            if(promises.length > 0){
            Promise.all(promises).then((results) => {
              var duplicateMutualCheck = {}
              var tagInfo = [];
              for(var i = 0; i < results.length; i++){
                var duplicateCheck = {};
                for(var key in results[i]){
                  if(results[i][key]["Author_ID"] == "test"){
                    continue;
                  }
                  if("Dish_ID" in results[i][key]){
                    var id = results[i][key]["Restaurant_ID"] + "_" + results[i][key]["Dish_ID"];
                    if(duplicateMutualCheck[results[i][key]["Author_ID"]] == undefined){
                      duplicateMutualCheck[results[i][key]["Author_ID"]] = {};
                      duplicateMutualCheck[results[i][key]["Author_ID"]][id] = 1;
                    }
                    else{
                      if(duplicateMutualCheck[results[i][key]["Author_ID"]][id] == undefined)
                      {
                        duplicateMutualCheck[results[i][key]["Author_ID"]][id] = 1;
                      }
                      else{
                        continue;
                      }
                    }
                }
                  else{
                    var id = results[i][key]["Restaurant_ID"];
                    if(duplicateMutualCheck[results[i][key]["Author_ID"]] == undefined){
                      duplicateMutualCheck[results[i][key]["Author_ID"]] = {};
                      duplicateMutualCheck[results[i][key]["Author_ID"]][id] = 1;
                    }
                    else{
                      if(duplicateMutualCheck[results[i][key]["Author_ID"]][id] == undefined)
                      {
                        duplicateMutualCheck[results[i][key]["Author_ID"]][id] = 1;
                      }
                      else{
                        continue;
                      }
                    }
                }

                  //Pushing final tag info
                  //Need: Time(for sorting), Mutual(bool(to show why card is being shown)), Dish_ID(If applicable), Restaurant_ID, Author_ID, isRestaurant
                  if("Dish_ID" in results[i][key]){
                    var tagObject = {
                      Time: results[i][key]["Date"],
                      Dish: results[i][key]["Dish_ID"],
                      Restaurant: results[i][key]["Restaurant_ID"],
                      isRestaurant: false,
                      Author: results[i][key]["Author_ID"]
                    };
                    tagInfo.push(tagObject);
                  }
                  else{
                    var tagObject = {
                      Time: results[i][key]["Date"],
                      Restaurant: results[i][key]["Restaurant_ID"],
                      isRestaurant: true,
                      Dish: "",
                      Author: results[i][key]["Author_ID"]
                    };
                    tagInfo.push(tagObject);
                  }
                }
              } //End of outer for loop
              tempArray = [];
              for(var i = 0; i < tagInfo.length; i++){
                tempArray.push(
                  <FeedCard key = {(i + 1) * -1}
                            handleToUpdate = {this.addView}
                            mutual = {false}
                            time = {tagInfo[i]["Time"]}
                            restaurantid = {tagInfo[i]["Restaurant"]}
                            isRestaurant = {tagInfo[i]["isRestaurant"]}
                            dishid = {tagInfo[i]["Dish"]}
                            userid = {tagInfo[i]["Author"]}/>
                );
              }
              this.recentCards = tempArray;
              this.setState({loading:false, displayCards: this.recentCards});

            }); //End of promise.all
          }
          else{
            this.setState({loading:false,
                          empty:true});
          }
         }

        });
    }


    //Check restaurant tags and dish tags for users that tagged same items
    //restaurants
    //Get Array of users
    //Get recent tags made by users:
    //Secondary: Get top 10 recent activity. Make sure duplicates are not put into Feed

  showCards = () =>{
    if(this.state.empty == true){
      return(
        <View style = {{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#F7F6F4'}}>
          <Text>{"No tag activity yet! You can start tagging on the Discover page!"}</Text>
        </View>
      );
    }
    else{
      console.log(this.state.displayCards);
      return(
        <View style = {styles.contentContainer}>
          {this.state.displayCards}
        </View>
      );
    }
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
      this.dishImage = snap.child("Photo").val();
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

  render(){
    if(this.state.loading == true){
      return (
        <View style = {styles.container}>
          <View style = {styles.header}>
            <LinearGradient colors = {['#F37439', '#F26A47']} style = {styles.linearGradient}>
              <View style = {{marginTop:_height * 0.05, alignItems:'center'}}>
                <Text style ={{fontSize: 20, color:'#FFFFFF', fontWeight:'600'}}>Feed</Text>
              </View>
              <View style = {styles.menu}>
              <TouchableOpacity activeOpacity = {0.8} onPress = {() => this.props.navigation.navigate('PersonalTags')}>
                <Image source = {require('../../images/icons/navigation/Menu.png')}
                       style = {{height: _height * 0.03, width: _width * 0.083}}
                       resizeMode = {'stretch'} />
              </TouchableOpacity>
            </View>
              <View style = {styles.bookmark}>
                <TouchableOpacity activeOpacity = {0.8}>
                  <Image source = {require('../../images/icons/navigation/Ditto.png')}
                         style = {{height: _height * 0.04, width: _width * 0.09}}
                         resizeMode = {'stretch'}/>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          <View style = {styles.content}>
            <View style = {{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#F7F6F4'}}>
              <Text>{"Loading..."}</Text>
            </View>
          </View>



          <View style = {styles.navBar}>
            <View style = {styles.innerBar}>
              <View style = {styles.navComponent}>
                <Image source = {require('../../images/icons/navigation/active/Feed_Active.png')}
                      style = {{width: _height * 0.036, height: _height * 0.036 }}/>
                <Text style = {{fontSize: 14, color:'#F52E13'}}>Feed</Text>
              </View>
                <TouchableOpacity style = {{flex:1}} activeOpacity = {0.8} onPress = {() => this.props.navigation.navigate('RestaurantPage')}>
                  <View style = {styles.navComponent}>
                    <Image source = {require('../../images/icons/navigation/inactive/Search_Inactive.png')}
                            style = {{width: _height * 0.036, height: _height * 0.036 }}/>
                    <Text style = {{fontSize: 14}}>Discover</Text>
                  </View>
                </TouchableOpacity>

            </View>
          </View>


      </View>
      );
    }
    else{
      return (
        <View style = {styles.container}>
          <View style = {styles.header}>
            <LinearGradient colors = {['#F37439', '#F26A47']} style = {styles.linearGradient}>
              <View style = {{marginTop:_height * 0.05, alignItems:'center'}}>
                <Text style ={{fontSize: 20, color:'#FFFFFF', fontWeight:'600'}}>Feed</Text>
              </View>
              <View style = {styles.menu}>
              <TouchableOpacity activeOpacity = {0.8} onPress = {() => this.props.navigation.navigate('PersonalTags')}>
                <Image source = {require('../../images/icons/navigation/Menu.png')}
                       style = {{height: _height * 0.03, width: _width * 0.083}}
                       resizeMode = {'stretch'}/>
              </TouchableOpacity>
            </View>
              <View style = {styles.bookmark}>
                <TouchableOpacity activeOpacity = {0.8}>
                  <Image source = {require('../../images/icons/navigation/Ditto.png')}
                         style = {{height: _height * 0.04, width: _width * 0.09}}
                         resizeMode = {'stretch'}/>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          <View style = {styles.content}>
            <ScrollView contentContainerStyle = {styles.scroll}>
              {this.showCards()}
            </ScrollView>
          </View>




          <View style = {styles.navBar}>
            <View style = {styles.innerBar}>
              <View style = {styles.navComponent}>
                <Image source = {require('../../images/icons/navigation/active/Feed_Active.png')}
                      style = {{width: _height * 0.036, height: _height * 0.036 }}/>
                <Text style = {{fontSize: 14, color:'#F52E13'}}>Feed</Text>
              </View>
                <TouchableOpacity style = {{flex:1}} activeOpacity = {0.8} onPress = {() => this.props.navigation.navigate('RestaurantPage')}>
                  <View style = {styles.navComponent}>
                    <Image source = {require('../../images/icons/navigation/inactive/Search_Inactive.png')}
                            style = {{width: _height * 0.036, height: _height * 0.036 }}/>
                    <Text style = {{fontSize: 14}}>Discover</Text>
                  </View>
                </TouchableOpacity>

            </View>
          </View>

          {this.renderView()}


      </View>
      );
    }

  }
}


const styles = StyleSheet.create({
  container:{
    flex:1
  },
  header:{
    height: _height * 0.12
  },
  linearGradient:{
    flex:1
  },
  menu:{
    position:'absolute',
    top: _height * 0.05,
    left: _width * 0.052
  },
  bookmark:{
    position:'absolute',
    top: _height * 0.05,
    right: _width * 0.052
  },
  content:{
    flex: 1,
    backgroundColor:'#F7F6F4',
  },
  scroll:{
    flexGrow:1,
    flexDirection: 'column'
  },
  contentContainer:{
    paddingTop: _height * 0.032,
    marginBottom: _height * 0.105
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
  }
});
