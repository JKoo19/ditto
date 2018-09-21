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
import NumberTag from '../../../common/NumberTag';
import DishImage from './DishImage';
import firebaseApp from '../../../../../../../Firebase';

const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class PhotolessItemCard extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      loading: true
    }
    this.dishID = this.props.id;
    this.tagCards = [];
  }

  componentDidMount(){
    firebaseApp.database().ref("Dish_Tags").orderByChild('Dish_ID').equalTo(this.props.id).once('value',(snap) =>{
      var tags = [];
      var allTags = {};
      snap.forEach(function(childSnapshot) {
        tags.push(childSnapshot.val());
      });
      console.log(tags);
      for(var i = 0; i < tags.length; i++){
        if(tags[i]["Restaurant_ID"] == this.props.restaurantid){
          console.log(this.props.restaurantid);
          console.log(tags[i]["Tag"]);
          if(!(tags[i]["Tag"] in allTags)){
            allTags[tags[i]["Tag"]] = 1;
          }
          else{
            allTags[tags[i]["Tag"]] = allTags[tags[i]["Tag"]] + 1;
          }
        }
      }
      var sortableArray = [];
      for (var key in allTags){
        sortableArray.push([key, allTags[key]]);
      }
      console.log(sortableArray);
      console.log("hut");
      sortableArray.sort((a, b) => a[1] < b[1] ? 1 : -1);
      console.log(sortableArray);
      for(var i = 0; i < sortableArray.length; i++){
        this.tagCards.push(
          <NumberTag  key = {i}
                      name = {sortableArray[i][0]}
                      numTags = {sortableArray[i][1]}/>
        )
      }
      this.setState({loading:false});
    });
  }

  renderTags = () => {
    if(this.state.loading == true)
    {
      return(
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }
    else {
      if(this.tagCards.length == 0){
        return(
          <View>

          </View>
        );
      }
      else{
        return(
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
            {this.tagCards}
          </ScrollView>
        );
      }
    }
  }

  render() {

    return (
      <View style = {styles.menuCard}>
        <View style = {styles.itemDescription}>
          <View>
            <Text style = {{fontSize: 15, fontWeight:'200', color:'#000000'}}>{this.props.dish}</Text>
          </View>
          <Text>{"$" + this.props.price + " | " + this.props.tagNum + " Tags"}</Text>
          <Text style = {{color:'#777777', fontSize: 10, lineHeight: 10}}
                numberOfLines = {3}>
                {"Ingredients: Potato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables otato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables otato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables otato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables otato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables otato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables otato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables, Potato, shrimp, noodles, vegetables "}
          </Text>
          <View style = {styles.itemTags}>

            {this.renderTags()}

          </View>
        </View>
        <Image source = {require('../../../../images/icons/add_tag.png')}
               style = {{height: _height * 0.0479, width: _height * 0.0479, position: 'absolute', right: _width * 0.018, top: _height * 0.009}}/>
      </View>
    );
  }
}



const styles = StyleSheet.create({

  menuCard:{
    flexDirection:'row',
    height: _height * 0.20,
    width: _width * 0.912,
    borderRadius: 6,
    elevation: 2,
    backgroundColor: '#FFFFFF',
    paddingLeft: _width * 0.0346,
    paddingTop: _height * 0.0105,
    paddingBottom: _height * 0.0165,
    marginBottom: 20
  },
  itemDescription:{
    flexDirection: 'column',
    justifyContent:'space-between'
  },
  itemTags:{
    flexDirection: 'row',
    width: _width * 0.88
  }
  });
