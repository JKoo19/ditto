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
  TextInput,
  TouchableOpacity,
  Platform,
  Linking
} from 'react-native';
import Tag from '../../common/Tag';
import WhiteTag from '../../common/WhiteTag';
import ItemCard from './common/ItemCard';
import Icon from './common/Icon';
import HeaderImage from './common/HeaderImage';
import Category from './common/Category';
import PhotolessCategory from './common/PhotolessCategory';
import Banner from './common/Banner';
import DishProfile from './DishProfile';
import WhiteBack from '../../common/WhiteBack';
import PhotolessItemCard from './common/PhotolessItemCard';
import firebaseApp from '../../../../../../Firebase';
import moment from 'moment';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;




export default class RestaurantProfile extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      loading:true,
      loadingContent:false,
      loadingDish: false,
      loadingTags: true,
      showDishView: false,
      showBy: 'popular',
      dishID:'',
    }
    this.currRestLatitude;
    this.currRestLongitude;
    this.dist;

    this.rootRef = firebaseApp.database().ref();
    this.name = '';
    this.cuisine = '';
    this.price = '';
    this.address = '';
    this.closing = '';
    this.description = '';
    this.categories = [];

    this.popularDishes = [];
    this.popularDishCards = [];
    this.galleryCategories = [];
    this.fullCategories = [];
    this.categoryObject;

    this.dishName = '';
    this.dishKey = '';
    this.dishPrice = '';
    this.dishTags = '';
    this.dishIngredients = '';
    this.dishImage = '';

    this.restaurantTags = [];

    this.googlemaps;

    this.Ref = firebaseApp.database().ref("Restaurants/" + this.props.navigation.getParam('id', 'error'));
    this.dishesRef = this.Ref.child('Dishes');
  }

componentDidMount(){

    this.Ref.once('value', (snap) => {
      var day = moment().format('dddd');
      this.name = snap.child('Name').val();
      this.cover = snap.child('Cover').val();
      this.cuisine = snap.child('Cuisine').val();
      this.price = snap.child('Price').val();
      this.address = snap.child('Address').val();
      this.closing = snap.child('Closing/' + day).val();
      this.description = snap.child('Description').val();
      this.categoryObject = snap.child('Categories').val();
      this.categories = Object.keys(snap.child('Categories').val());
      this.currRestLatitude = snap.child('Location/Latitude').val();
      this.currRestLongitude = snap.child('Location/Longitude').val();

    });

    firebaseApp.database().ref("Restaurant_Tags").orderByChild('Restaurant_ID')
                      .equalTo(this.props.navigation.getParam('id', 'error'))
                      .once('value',(snap) =>{
      var tags = [];
      var allTags = {};

      snap.forEach(function(childSnapshot) {
        tags.push(childSnapshot.val());
      });
      console.log(tags);
      for(var i = 0; i < tags.length; i++){
        if(!(tags[i]["Tag"] in allTags)){
          allTags[tags[i]["Tag"]] = 1;
        }
        else{
          allTags[tags[i]["Tag"]] = allTags[tags[i]["Tag"]] + 1;
        }
      }
      console.log(allTags);
      var sortableArray = [];
      for (var key in allTags){
        sortableArray.push([key, allTags[key]]);
      }
      sortableArray.sort((a, b) => a[1] < b[1] ? 1 : -1);
      for(var i = 0; i < sortableArray.length; i++){
        console.log("White tag pushed");
        this.restaurantTags.push(
          <WhiteTag key = {i}
                    name = {sortableArray[i][0]}
                    numTags = {sortableArray[i][1]}/>
        );
      }


      this.setState({loadingTags:false});
    });


    //For Popular dishes:
    var ref = this.dishesRef.orderByChild('Tags').once('value', (snap) =>{
      var myArray = [];
      var keys = [];
      snap.forEach(function(childSnapshot) {
        myArray.push(childSnapshot.val());
        keys.push(childSnapshot.key);

      });
      //PopularDishes just holds information to pass to items to be rendered later.
      this.popularDishes = myArray;
      var limit = 10
      if(this.popularDishes.length < 10){
        limit = this.popularDishes.length;
      }
      var dishesRegistered = 0;
      for(var i = 0; i < this.popularDishes.length; i++){

        if(dishesRegistered >= limit){
          break;
        }
        //popularDishCards holds the actual items to be rendered.
        if(this.popularDishes[this.popularDishes.length - 1 - i]["Photo"] == ""){
          continue;
        }
        else{
          dishesRegistered++;
          this.popularDishCards.push(
            <ItemCard key = {i}
                      restaurantid = {this.props.navigation.getParam('id', 'error')}
                      id = {keys[this.popularDishes.length - 1 - i]}
                      handleToUpdate = {this.addView}
                      price = {this.popularDishes[this.popularDishes.length - 1 - i]["Price"]}
                      tagNum = {this.popularDishes[this.popularDishes.length - 1 - i]["Tags"]}
                      dish = {this.popularDishes[this.popularDishes.length - 1 - i]["Name"]}
                      photo = {this.popularDishes[this.popularDishes.length - 1 - i]["Photo"]}/>
          );
        }
      }

    });
    //Set up category pickers: for photo + no photo
    //Photo
    this.dishesRef.once('value', (snap) => {
      for(var i = 0; i < this.categories.length; i++){
        this.galleryCategories.push(<Category key = {i}
                                              addUpdate = {this.addContent}
                                              removeUpdate = {this.removeContent}
                                              handleToUpdate = {this.addView}
                                              restaurantid = {this.props.navigation.getParam('id', 'error')}
                                              category = {this.categories[i]}/>);
      }
      //No Photo
      for(var i = 0; i < this.categories.length; i++){
        this.fullCategories.push(<PhotolessCategory key = {i}
                                                    addUpdate = {this.addContent}
                                                    removeUpdate = {this.removeContent}
                                                    handleToUpdate = {this.addView}
                                                    restaurantid = {this.props.navigation.getParam('id', 'error')}
                                                    category = {this.categories[i]}
                                                    amount = {this.categoryObject[this.categories[i]]}/>);
    }});

    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${this.currRestLatitude},${this.currRestLongitude}`;
    const label = this.name;
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
  //  if(this.restaurantTags.length == 0){
      //return(
      //  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle = {styles.tags}>
        //  <Text>{"No tags for this restaurant yet!"}</Text>

      //  </ScrollView>
    //  );
  //  }
    return(
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle = {styles.tags}>
        {this.restaurantTags}

      </ScrollView>
    );
  }

  renderCategory = () => {
      if(this.state.loadingContent == true){
        <View style = {{flex: 1, backgroundColor:'#FFFFFF', justifyContent:'center', alignItems:'center'}}>
          <Text>Loading...</Text>
        </View>
      }
      else{
        if(this.state.showBy == 'popular')
        {

          return(
            <View>
              {this.popularDishCards}
            </View>
          );
        }
        else if(this.state.showBy == 'gallery') {
          return(
            <View>
              {this.galleryCategories}
            </View>
          );
        }
        else if(this.state.showBy == 'menu'){
          return(
            <View>
              {this.fullCategories}
            </View>
          );
        }
      }
  }

  addView = (dish) => {
    this.setState({
      //Set states here for what to pass into the dishView, and then use those states to pass props into dishView
      loadingDish:true,
      showDishView: true,
    });

    this.dishesRef.child(dish).once('value', (snap) => {
      this.dishKey = dish;
      this.dishName = snap.child("Name").val();
      this.dishPrice = snap.child("Price").val();
      this.dishTags = snap.child("Tags").val();
      this.dishIngredients = snap.child("Ingredient").val();
      this.dishImage = snap.child("Photo").val();

      this.setState({
        loadingDish:false,

      });
    });

  }

  removeView = () => {
    this.setState({
      showDishView: false
    });
  }

  addContent = () => {
    this.setState({
      loadingContent: true
    });
  }

  removeContent = () => {
    this.setState({
      loadingContent: false
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
            <DishProfile  restaurantid = {this.props.navigation.getParam('id', 'error')}
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

  selectPopular = () =>{
    this.setState({
      showBy: 'popular'
    });
  }

  selectGallery = () =>{
    this.setState({
      showBy: 'gallery'
    });
  }

  selectMenu = () =>{
    this.setState({
      showBy: 'menu'
    });
  }

  renderPicker = () => {
    if(this.state.showBy == 'popular')
    {
      return(
        <View style = {styles.picker}>
          <View style = {{alignItems:'center'}}>
            <Text style = {{fontSize:12, color:'#F52E13'}}>POPULAR</Text>
            <Text style = {{fontSize:12, color:'#F52E13'}}>V</Text>
          </View>
          <Text style ={{fontSize:12}} onPress = {() => this.selectGallery()}>MENU GALLERY</Text>
          <Text style ={{fontSize:12}} onPress = {() => this.selectMenu()}>FULL MENU</Text>
        </View>
      );
    }
    else if(this.state.showBy == 'gallery')
    {
      return(
        <View style = {styles.picker}>
          <Text style ={{fontSize:12}} onPress = {() => this.selectPopular()}>POPULAR</Text>
          <View style = {{alignItems:'center'}}>
            <Text style ={{fontSize:12, color:'#F52E13'}}>MENU GALLERY</Text>
            <Text style = {{fontSize:12, color:'#F52E13'}}>V</Text>
          </View>
          <Text style ={{fontSize:12}} onPress = {() => this.selectMenu()}>FULL MENU</Text>
        </View>
      );
    }
    else if(this.state.showBy == 'menu')
    {
      return(
        <View style = {styles.picker}>
          <Text style ={{fontSize:12}} onPress = {() => this.selectPopular()}>POPULAR</Text>
          <Text style ={{fontSize:12}} onPress = {() => this.selectGallery()}>MENU GALLERY</Text>
          <View style = {{alignItems:'center'}}>
            <Text style ={{fontSize:12, color:'#F52E13'}}>FULL MENU</Text>
            <Text style = {{fontSize:12, color:'#F52E13'}}>V</Text>
          </View>
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
    else if(this.props.navigation.getParam('id', 'error') == 'error')
    {
      <View style = {{flex:1, justifyContent:'center',alignItems:'center'}}>
        <Text>"An error occurred"</Text>
        <Text>"Sorry, this page is not accessible"</Text>
      </View>
    }
    else{
      return (
        <View style = {styles.container}>
          <ScrollView contentContainerStyle = {styles.contentContainer}>
            <HeaderImage uri = {this.cover}/>
            <WhiteBack />
            <View style = {styles.content}>
              {/*Start of menu content*/}
              <View style = {styles.tagHolder}>
                {this.renderTags()}
              </View>

              {this.renderPicker()}

              <View style = {styles.cardList}>
                {this.renderCategory()}
              </View>
            </View>


            <Banner title = {this.name}
                    cost = {this.price}
                    cuisine = {this.cuisine}
                    restaurantid = {this.props.navigation.getParam('id', 'error')}
                    tags = {750}
                    closing ={this.closing}
                    description = {this.description}
                    showMap = {this.navigateGoogle}/>


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
  back:{
    position:'absolute',
    top:30,
    left:30,
    height:20,
    width:20
  },
  content:{
    backgroundColor:'#F7F3F1',
    flex: 1
  },
  tagHolder:{
    marginTop: _height * 0.166,
    alignItems:'center',
    height: _height * 0.064,
    backgroundColor:'#EEEDED'
  },
  tags:{
    alignItems:'center',
    paddingLeft:5
  },
  picker:{
    marginTop: _height * 0.027,
    flexDirection:'row',
    justifyContent:'space-around',
    height: _height * 0.039
  },
  cardList:{
    alignItems:'center',
    marginTop: _height * 0.037
  }
});
