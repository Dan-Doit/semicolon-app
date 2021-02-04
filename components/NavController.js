import React from "react";
//import { AntDesign  } from '@expo/vector-icons';
//import { View } from 'react-native';
import { useIsLoggedIn } from "../AuthContext";
import MainNavigation from "../navigation/MainNavigation"; 
import AuthNavigation from "../navigation/AuthNavigation";
  
export default () => {
  const isLoggedIn = useIsLoggedIn();
  
  return isLoggedIn ? <MainNavigation /> : <AuthNavigation />;
}