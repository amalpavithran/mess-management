import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Container, Text, Button, Content, Header, Form, Item, Input, Label, Left, Body, Title, Right, Subtitle, Row } from 'native-base';
import SignupScreen from './Signup';
import Extras from './Extras';
import Signin from './Signin';

// Photo by Cayla1 on Unsplash
export let validSession = false;


export class App extends Component {
  render() {
    return <AppNavigator />
  }
  
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: Signin,
    navigationOptions: {
      title: 'Home',
      headerShown: false
    },
  },
  Signup: {
    screen: SignupScreen,
    navigationOptions: {
      title: 'SignUp',
      headerShown: false
    },
  },
  Extras: {
    screen: Extras,
    navigationOptions: {
      title: 'Extras',
      headerShown: false
    },
  }
},
  {
    initialRouteName: 'Home'
  }
);

export default createAppContainer(AppNavigator);

