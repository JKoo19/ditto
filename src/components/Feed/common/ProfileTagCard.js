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
import DishImage from '../../Restaurants/RestaurantProfile/common/DishImage';
import firebaseApp from '../../../../../../Firebase';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

class ProfileTagCard extends Component<Props> {
  constructor(props){
    super(props);

    this.state = {
      loading: true,
    }

    this.photo = '';
    this.name = '';
    this.price = '';
    this.tagNum;
    this.tags = [];
  }

  componentDidMount(){
    if(this.props.isRestaurant == true){
      firebaseApp.database().ref("Restaurants").child(this.props.restaurantid).once('value')
        .then((snap) =>{
          this.photo = snap.val()["Cover"];
          this.name = snap.val()['Name'];
          this.price = snap.val()['Price'];
          this.tagNum = snap.val()['Tags'];


        }).then(() =>{
          firebaseApp.database().ref("Restaurant_Tags").orderByChild("Author_ID").equalTo(this.props.userid)
            .once('value').then((snap) =>{
              var tags = [];
              var i = 0;
              for(var key in snap.val()){
                if(snap.val()[key]['Restaurant_ID'] == this.props.restaurantid){
                  tags.push(
                    <UserTag name = {snap.val()[key]['Tag']}
                             key = {i}/>
                           );
                  i++;
                }
              }
              this.tags = tags;

              this.setState({loading:false});
            });
        });
    }
    else{
      firebaseApp.database().ref("Restaurants").child(this.props.restaurantid + "/Dishes/" + this.props.dishid).once('value')
        .then((snap) =>{
          console.log(this.props.restaurantid);
          console.log(this.props.dishid);
          console.log(snap.val());
          console.log("in here");
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

        }).then(() =>{
            firebaseApp.database().ref("Dish_Tags").orderByChild("Author_ID").equalTo(this.props.userid)
              .once('value').then((snap) =>{
                var tags = [];
                var i = 0;
                for(var key in snap.val()){
                  if(snap.val()[key]['Restaurant_ID'] == this.props.restaurantid && snap.val()[key]['Dish_ID'] == this.props.dishid){
                    tags.push(
                      <UserTag name = {snap.val()[key]['Tag']}
                               key = {i}/>
                             );
                    i++;
                  }
                }
                this.tags = tags;

            this.setState({loading:false});
        });
    });
  }
}

  renderTags = () => {
    return(
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
        {this.tags}
      </ScrollView>
    );
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
        <View style = {styles.menuCard}>
          <View style = {{flex:1, justifyContent:'center',alignItems:'center'}}>
            <Text>One moment...</Text>
          </View>
        </View>
      );
    }
    return (
      <View style = {styles.menuCard}>
        {this.renderImage()}
        <View style = {styles.itemDescription}>
          {this.renderName()}
          <Text>{this.price + " | " + this.tagNum + " Tags"}</Text>
          <View style = {styles.itemTags}>
            {this.renderTags()}
          </View>
        </View>
      </View>
    );
  }
}
export default withNavigation(ProfileTagCard);

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
    width: _width * 0.55,
    height: _height * 0.0329
  }
});
