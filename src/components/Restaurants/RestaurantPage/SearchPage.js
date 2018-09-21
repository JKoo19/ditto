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
  TouchableOpacity,
  TouchableHighlight,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import SearchSuggestion from './common/SearchSuggestion'


const _height = Dimensions.get("window").height;
const _width = Dimensions.get("window").width;

class SearchPage extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      typingText: this.props.keyword,
      searchText: this.props.keyword,
      typingLocation:this.props.location,
      location:this.props.location,
      locationFocus:false

    }
  }

  searchIsFocused = () => {
    this.setState({
      typingText: ''
    });
  }

  searchLostFocus = () => {
    if(this.state.typingText == '')
    {
      if(this.state.searchText == '')
      {
        this.setState({
          typingText: "Search for Restaurants"
        });
      }
      else{
        this.setState({
          typingText: this.state.searchText
        });
      }
    }
  }


locationIsFocused = () => {
  this.setState({
    typingLocation: '',
    locationFocus:true
  });
}

locationLostFocus = () => {
  if(this.state.typingLocation == '')
  {
    this.setState({
      typingLocation: this.state.location
    });
  }
  this.setState({
    locationFocus:false
  });
}

suggestionPress = (title) => {
  this.setState({typingText: title}, function () {
    this.props.navigation.push("SearchResults",
    {
      search:this.state.typingText,
      location:this.state.typingLocation
    });

  });
}

locationPress = (title) => {
  this.setState({typingLocation: title}, function () {
    if(this.state.typingText != '')
    {
      this.props.navigation.push("SearchResults",
      {
        search:this.state.typingText,
        location:this.state.typingLocation
      });
    }
  });
}

navigateSearch = () => {
  if(this.state.typingText != '')
  {
    this.props.navigation.push("SearchResults", {
      search:this.state.typingText,
      location:this.state.typingLocation
    });
  }
}

suggestionType = () => {
  if(this.state.locationFocus)
  {
    return(
    <SearchSuggestion title = {'Current Location'}
                      handleToUpdate = {this.locationPress}/>
                    );
  }
  else {
    return(
    <View>
    <SearchSuggestion title = {'American'}
                      handleToUpdate = {this.suggestionPress}/>
    <SearchSuggestion title = {'Chinese'}
                      handleToUpdate = {this.suggestionPress}/>
    <SearchSuggestion title = {'Hawaii'}
                      handleToUpdate = {this.suggestionPress}/>
    <SearchSuggestion title = {'Bar'}
                      handleToUpdate = {this.suggestionPress}/>
    <SearchSuggestion title = {'Breakfast'}
                      handleToUpdate = {this.suggestionPress}/>
    </View>
                    );
  }
}

  render() {

    var handleToUpdate  =   this.props.handleToUpdate;

    return (
      <View style = {{flex:1}}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style = {styles.container}>

            <View style = {styles.header}>
              <LinearGradient colors = {['#F37439', '#F26A47']} style = {styles.linearGradient}>
                <TouchableOpacity activeOpacity = {0.8}
                                  onPress = {() => handleToUpdate()}
                                  style = {styles.cancel}>
                    <Text style = {{color:'#FFFFFF', fontSize: 14}}>Cancel</Text>
                </TouchableOpacity>

                <TextInput  autoFocus = {true}
                            onFocus ={this.searchIsFocused}
                            onBlur = {this.searchLostFocus}
                            style={styles.search}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value = {this.state.typingText}
                            onChangeText={(typingText) => this.setState({typingText})}
                            onSubmitEditing = {() => this.navigateSearch()}
                            textAlign= 'center'
                            textAlignVertical='center'
                            placeholder='Search for Restaurants'
                            placeholderTextColor="#FFFFFF"
                            returnKeyType="search"/>

                <TouchableOpacity style = {styles.search2}
                                  onPress  = {() => this.navigateSearch()}>
                    <Text style = {{color:'#FFFFFF'}}>Search</Text>
                </TouchableOpacity>

              </LinearGradient>
            </View>

            <View style = {styles.suggestions}>


            </View>

          </View>
        </TouchableWithoutFeedback>
      </View>




    );
  }
}

export default withNavigation(SearchPage);

const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  header:{
    elevation: 2,
    height: _height * 0.195,
    width: _width
  },
  linearGradient:{
    flex: 1
  },
  cancel:{
    alignSelf:'flex-end',
    marginTop: _height * 0.044,
    marginRight: _width * 0.043
  },
  search:{
    marginTop: _height * 0.013,
    height: _height * 0.0389,
    marginHorizontal: _width * 0.032,
    borderRadius: 15,
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    color:'#FFFFFF'
  },
  search2:{
    marginTop: _height * 0.018,
    height: _height * 0.0389,
    marginHorizontal: _width * 0.3,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255, 0.5)',
    justifyContent:'center',
    alignItems:'center'
  },
  suggestions:{
    backgroundColor:'#FFFFFF'
  },
  suggestion:{
    backgroundColor:'#FFFFFF',
    flexDirection:'row',
    height: _height * 0.057,
    borderWidth: 0.5,
    borderColor:'#DDDEDF',
    alignItems:'center'
  }
});
