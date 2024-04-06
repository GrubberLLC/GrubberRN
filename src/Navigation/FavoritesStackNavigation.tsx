import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FavoriteScreen from '../Screens/Favorites/FavoriteScreen';
import FavoritesSinglePlaceScreen from '../Screens/Favorites/FavoritesSinglePlaceScreen';

const StackNav = createStackNavigator();

const FavoritesStackNavigation = () => {
  return (
    <StackNav.Navigator
      initialRouteName="ListScreens"
      screenOptions={{headerShown: false}}>
      <StackNav.Screen name="FavoriteScreen" component={FavoriteScreen} />
      <StackNav.Screen name="FavoritesSinglePlaceScreen" component={FavoritesSinglePlaceScreen} />
    </StackNav.Navigator>
  );
};

export default FavoritesStackNavigation;
