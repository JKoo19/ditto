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
import ProfileTagCard from './common/ProfileTagCard'
import WhiteUserTag from './common/WhiteUserTag'
import WhiteBack from '../common/WhiteBack';
import DishProfile from '../Restaurants/RestaurantProfile/DishProfile';
import LinearGradient from 'react-native-linear-gradient';
import LikesCard from './common/LikesCard';
import MineCard from './common/MineCard';

import moment from 'moment';
import firebaseApp from '../../../../../Firebase';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class PersonalTags extends Component<Props> {
  constructor(props){
    super(props);

    this.state = {
      showDishView: false,
      showLikes: true,
      loading: true,
      mineLoading: true
    }
    this.likeCards = [];
    this.mineCards = [];
  }

  componentDidMount(){
    firebaseApp.database().ref("Tag_Likes").orderByChild("Liker").equalTo("test")
      .once('value').then((snap) =>{

        sortedLikes = [];
        for(var key in snap.val()){
          var newObject = snap.val()[key];
          newObject['Key'] = key
          sortedLikes.push(newObject);
        }
        sortedLikes.sort((a, b) => a['Time'] < b['Time'] ? 1 : -1);

        for(var i = 0; i < sortedLikes.length; i++){
          this.likeCards.push(
            <LikesCard key = {sortedLikes[i]["Key"]}
                       handleToUpdate = {this.addView}
                       userid = {sortedLikes[i]["Author"]}
                       dishid = {sortedLikes[i]["Dish_ID"]}
                       restaurantid = {sortedLikes[i]["Restaurant_ID"]}
                       isRestaurant = {sortedLikes[i]["isRestaurant"]}
                       tags = {sortedLikes[i]["Tags"]} />
          );
        }
        console.log(sortedLikes);
        this.setState({loading:false});
      });
      var promises = [];
      var restaurantTags = firebaseApp.database().ref("Restaurant_Tags").orderByChild("Author_ID").equalTo("test")
        .once('value').then((snap) =>{
          return snap.val();
        })
      promises.push(restaurantTags);
      var dishTags = firebaseApp.database().ref("Dish_Tags").orderByChild("Author_ID").equalTo("test")
        .once('value').then((snap) =>{
          return snap.val();
        })
        promises.push(dishTags);
      Promise.all(promises).then((results) =>{
        var allTags = [];
        for(var i = 0; i < results.length; i++){
          for(var key in results[i]){
            var newObject = results[i][key];
            newObject['Key'] = key;
            allTags.push(newObject);
          }
        }
        allTags.sort((a, b) => a['Date'] < b['Date'] ? 1 : -1);

        console.log(allTags);
        for(var i = 0; i < allTags.length; i++){
          if("Dish_ID" in allTags[i]){
            this.mineCards.push(
              <MineCard key = {allTags[i]["Key"]}
                        handleToUpdate = {this.addView}
                        restaurantid = {allTags[i]["Restaurant_ID"]}
                        dishid = {allTags[i]["Dish_ID"]}
                        tag = {allTags[i]["Tag"]}
                        isRestaurant = {false}
                        date = {allTags[i]["Date"]} />

            );
          }
          else{
            this.mineCards.push(
              <MineCard key = {allTags[i]["Key"]}
                        handleToUpdate = {this.addView}
                        restaurantid = {allTags[i]["Restaurant_ID"]}
                        dishid = {''}
                        tag = {allTags[i]["Tag"]}
                        isRestaurant = {true}
                        date = {allTags[i]["Date"]} />
            );
          }

        }
        this.setState({mineLoading: false});
      });



  }

  showLikes = () =>{
    this.setState({showLikes: true});
  }
  showMine = () =>{
    this.setState({showLikes:false});
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

  renderView(){
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

  renderCards(){
    if(this.state.showLikes){
      return(
        <View style = {styles.content}>
          {this.likeCards}
        </View>
      );
    }
    else{
      if(this.state.mineLoading == true){
        return(
          <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text>One Moment...</Text>
          </View>
        );
      }
      return(
        <View style = {styles.content}>
          {this.mineCards}
        </View>
      );
    }
  }

  renderLikes(){
    if(this.state.showLikes){
      return(
        <View style = {{marginTop:_height * 0.05, flexDirection:'row', justifyContent:'center'}}>
          <View style = {{borderBottomWidth: 2, borderBottomColor:'#fff', marginRight: _width * 0.18}}>
            <Text style = {{fontSize: 17, color:'#FFFFFF', fontWeight:'600'}}>{"Likes"}</Text>
          </View>
          <TouchableOpacity activeOpacity = {0.8} onPress ={() => this.showMine()}>
            <View>
              <Text style ={{fontSize: 17, color:'#FFFFFF', fontWeight:'500'}}>{"Mine"}</Text>
            </View>
          </TouchableOpacity>
        </View>);
    }
    else{
      return(
        <View style = {{marginTop:_height * 0.05, flexDirection:'row', justifyContent:'center'}}>
          <TouchableOpacity activeOpacity = {0.8} onPress ={() => this.showLikes()}>
            <View style = {{marginRight: _width * 0.18}}>
              <Text style ={{fontSize: 17, color:'#FFFFFF', fontWeight:'500'}}>{"Likes"}</Text>
            </View>
          </TouchableOpacity>
          <View style = {{borderBottomWidth: 2, borderBottomColor:'#fff'}}>
            <Text style ={{fontSize: 17, color:'#FFFFFF', fontWeight:'600'}}>{"Mine"}</Text>
          </View>
        </View>);
    }
  }


  render() {
    return (
    <View style = {styles.container}>
      <View style = {styles.header}>
        <LinearGradient colors = {['#F37439', '#F26A47']} style = {styles.linearGradient}>
            {this.renderLikes()}
          <WhiteBack />
        </LinearGradient>
      </View>

     <ScrollView contentContainerStyle = {styles.contentContainer}>
        {this.renderCards()}

      </ScrollView>

      {this.renderView()}
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
  header:{
    height: _height * 0.12
  },
  linearGradient:{
    flex:1
  },
  content:{
    alignItems:'center',
    paddingTop: 20
  }
});
