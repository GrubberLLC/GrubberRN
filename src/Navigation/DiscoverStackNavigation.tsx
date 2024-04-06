import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import PostsScreen from '../Screens/Posts/PostsScreen';
import DiscoverScreen from '../Screens/Discover/DiscoverScreen';

const StackNav = createStackNavigator();

const DiscoverStackNavigation = () => {
  return (
    <StackNav.Navigator
      initialRouteName="DiscoverScreen"
      screenOptions={{headerShown: false}}>
      <StackNav.Screen name="DiscoverScreen" component={DiscoverScreen} />
    </StackNav.Navigator>
  );
};

export default DiscoverStackNavigation;
