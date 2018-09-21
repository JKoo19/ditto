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
  TouchableOpacity
} from 'react-native';
import Tag from '../../common/Tag';
import NumberTag from '../../common/NumberTag';
import firebaseApp from '../../../../../../Firebase';


const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class DishProfile extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      loading:true
    }
    this.tagCards1 = [];
    this.tagCards2 = [];
    //create another state and make the if statement dual condition
  }

  componentDidMount(){
    firebaseApp.database().ref("Dish_Tags").orderByChild('Dish_ID').equalTo(this.props.dishid).once('value',(snap) =>{
      var tags = [];
      var allTags = {};
      snap.forEach(function(childSnapshot) {
        tags.push(childSnapshot.val());
      });
      for(var i = 0; i < tags.length; i++){
        if(tags[i]["Restaurant_ID"] == this.props.restaurantid){
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
      sortableArray.sort((a, b) => a[1] < b[1] ? 1 : -1);
      for(var i = 0; i < sortableArray.length; i++){
        if(i % 2 == 0){
          this.tagCards1.push(
            <NumberTag  key = {i}
                        name = {sortableArray[i][0]}
                        numTags = {sortableArray[i][1]}/>
          );
        }
        else{
          this.tagCards2.push(
            <NumberTag  key = {i}
                        name = {sortableArray[i][0]}
                        numTags = {sortableArray[i][1]}/>
          );
        }

      }
      this.setState({loading:false});
    });
  }

  renderTags = () => {
    if(this.state.loading == true)
    {
      return(
        <View style = {{borderTopWidth:1, marginTop: _height * 0.035}}>
          <Text>Loading...</Text>
        </View>
      );
    }
    else {
      if(this.tagCards1.length == 0){
        return(
          <View style = {{borderTopWidth:1, marginTop: _height * 0.035}}>
          </View>
        );
      }
      else{
        return(
          <View style = {{borderTopWidth:1, marginTop: _height * 0.035}}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tags}>
                <View style = {styles.rowOne}>
                  {this.tagCards1}
                </View>
                <View style = {styles.rowTwo}>
                  {this.tagCards2}
                </View>
              </ScrollView>
          </View>
        );
      }
    }
  }

  render() {

    var handleToUpdate  =   this.props.handleToUpdate;

    if(this.props.loading == true){
      return(
        <View style = {styles.container}>
          <View style = {styles.background}>
          </View>

          <View style = {styles.cardsurround}
            pointerEvents='box-none'>
            <View style = {{height: _height * 0.737,
                            width: _width * 0.88,
                            backgroundColor:'#FFFFFF',
                            borderRadius: 15,
                            elevation: 2,
                            justifyContent:'center',
                            alignItems:'center'}}>
              <Text>Loading...</Text>
            </View>
          </View>

        </View>
      );
    }
    else if(this.props.loading == false){
      return (
        <View style = {styles.container}>
          <View style = {styles.background}>
          </View>

          <View style = {styles.cardsurround}
            pointerEvents='box-none'>
            <View style = {styles.card}>
              <View style = {styles.title}>
                <Text style = {{fontSize: 16, fontWeight: '500', color:'#000000'}}>{this.props.name}</Text>
              </View>
              <View style = {styles.description}>
                <Text style = {{fontSize: 13, color:'#777777'}}>{"$" + this.props.price + " | " +
                                                                this.props.tagNum + " Tags"}</Text>
              </View>
              <TouchableOpacity onPress = {() => handleToUpdate()}
                                style = {styles.exit}>
                  <Text>x</Text>
              </TouchableOpacity>
              <View style = {styles.imagecontainer}>
                <Image source = {{uri: this.props.uri}}
                       style = {{flex:1,
                                height: null,
                                resizeMode: 'contain',
                                width: null,
                              }}/>
              </View>
              <View style = {styles.ingredients}>
                <Text style = {{color:'#777777', fontSize: 10}}>
                  {"Ingredients:"}
                </Text>
                <Text style = {{color:'#777777', fontSize: 10, lineHeight: 10}}
                      numberOfLines = {6}>
                      {this.props.ingredients}
                </Text>
              </View>

              {this.renderTags()}

            </View>
          </View>

        </View>
      );
    }
  }
}



const styles = StyleSheet.create({
  container:{
    position:'absolute',
    top: 0,
    bottom: 0,
    left:0,
    right:0,
  },
  background:{
    backgroundColor:'rgba(150, 150, 150, 0.7)',
    position:'absolute',
    height: _height * 2,
    width: _width * 2,
    top: 0,
    bottom: 0,
    left:0,
    right:0,
  },
  cardsurround:
  {
    position:'absolute',
    top: _height * 0.121,
    right: 0,
    left: 0,
    height: _height * 0.87,
    alignItems:'center'
  },
  card:{
    height: _height * 0.737,
    width: _width * 0.88,
    backgroundColor:'#FFFFFF',
    borderRadius: 15,
    elevation: 2
  },
  exit:{
    position:'absolute',
    height: 30,
    width: 30,
    top: 10,
    right: 10,
    justifyContent:'center',
    alignItems:'center'
  },
  title:{
    marginTop: _height * 0.027,
    marginLeft: _width * 0.0213,
    marginBottom: _height * 0.013
  },
  description:{
    marginLeft: _width * 0.0213,
    marginBottom: _height * 0.019
  },
  imagecontainer:{
    height: _height * 0.374
  },
  ingredients:{
    marginLeft: _width * 0.0213,
    height: _height * 0.0869
  },
  tags:{
    marginLeft: _width * 0.0213,
    flexDirection: 'column'
  },
  rowOne:{
    flexDirection:'row',
    marginTop: 10
  },
  rowTwo:{
    flexDirection:'row',
    marginTop: _height * 0.0255
  }
});
