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
  Dimensions,
  TouchableHighlight,
} from 'react-native';



const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

export default class SearchSuggestions extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render() {

    var handleToUpdate  =   this.props.handleToUpdate;

    return (
        <TouchableHighlight style = {styles.suggestion}
                            underlayColor = {'#DDDEDF'}
                            onPress = {() => handleToUpdate(this.props.title)}>
          <View style = {{flexDirection:'row', width: _width}}>
            <Text style = {{color:'#000000', fontWeight: '500', fontSize:14}}>{this.props.title}</Text>

            <View style = {{height: _height * 0.057, position:'absolute', right:20}}>
              <View>
                <Text>{">"}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>






    );
  }
}


const styles = StyleSheet.create({
  suggestion:{
    backgroundColor:'#FFFFFF',
    flexDirection:'row',
    height: _height * 0.057,
    borderWidth:0.5,
    borderColor:'#DDDEDF',
    alignItems:'center',
    paddingLeft: 10,
    width: _width
  }
});
