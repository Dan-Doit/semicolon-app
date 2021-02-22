import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import React from "react";
import Home from "../screens/home/Home";
import Search from "../screens/tabs/Search/index";
import Notifications from "../screens/tabs/Notifications";
import MessagesLink from "../components/MessagesLink";
import Profile from "../screens/tabs/Profile";
import Detail from "../screens/Detail";
import { createStackNavigator } from 'react-navigation-stack';
import { Platform } from "react-native";
import NavIcon from "../components/NavIcon";
import { AntDesign } from '@expo/vector-icons'; 
import styles from "../styles";
import StoryLink from "../components/StoryLink";
import UserDetail from "../screens/UserDetail";
import CommentDetail from "../screens/CommentDetail";
import NavigationContainer from "./EventNavigation/index";
import Tag from "../screens/Tag";

const stackFactory = (initialRoute, customConfig) =>
  createStackNavigator(
    {
      InitialRoute: {
        screen: initialRoute,
        navigationOptions: {
          ...customConfig
        }
      },
      Detail: {
        screen: Detail,
        navigationOptions: {
          headerBackTitle:" ",
          headerTintColor: styles.blackColor,
          title: "Post"
        }
      },
      Tag: {
        screen: Tag,
        navigationOptions: ({ navigation }) => ({
          title: navigation.getParam("term")
        })
      },
      UserDetail: {
        screen: UserDetail,
        navigationOptions: ({ navigation }) => ({
          title: navigation.getParam("username")
        })
      },
      
      CommentDetail: {
       screen: CommentDetail,
        navigationOptions: {
          headerBackTitle:" ",
          headerTintColor: styles.blackColor,
          title: "Comments"
        }
      }
    },
    {
      defaultNavigationOptions: {
        headerBackTitle: " ",
        headerTintColor:styles.blackColor
    }
  });

export default createBottomTabNavigator(
  {
    Home: {
      screen: stackFactory(Home, {
        headerRight: <MessagesLink />,
        headerLeft:<StoryLink />,
        headerTitle:()=><NavigationContainer />
      }),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <NavIcon
            focused={focused}
            name={ focused ? "home-sharp" : "home-outline"} />
        )
      }
    },
    Search: {
      screen: stackFactory(Search, {
        headerBackTitle:null
      }),
      navigationOptions: {
        headerBackTitle:" ",
        tabBarIcon: ({focused}) => (
          <NavIcon
            focused={focused}
            name={Platform.OS === "ios" ?
              (focused ? "ios-search-sharp" : "ios-search-outline")
              :
              (focused ? "md-search-sharp" : "md-search-outline")
            }
            size={28}/>
        )
      }
    },
    Add: {
      screen: View,
      navigationOptions: {
        tabBarOnPress: ({ navigation }) =>
          navigation.navigate("PhotoNavigation"),
          tabBarIcon: ({focused}) => (
            <NavIcon
              focused={focused}
              name={Platform.OS === "ios" ? "ios-add" : "md-add"}
              size={32} />
          )
        }
      },
      Notifications: {
        screen: stackFactory(Notifications, {
          title: "Notifications"
        }),
        navigationOptions: {
          tabBarIcon: ({ focused }) => (
            <AntDesign
              focused={focused}
              name={focused ? "star" : "staro"}
              color={focused ? styles.navyColor : styles.darkGreyColor}
              size={26} />
        )
      }
    },
    Profile: {
      screen: stackFactory(Profile, {
        title: "Profile"
      }),
      navigationOptions: {
        tabBarIcon: ({focused}) => (
          <NavIcon
            focused={focused}
            name={focused ? "person" : "person-outline"} />
        )
      }
    }
  },
  {
    initialRouteName:"Home",
    tabBarOptions: {
      showLabel: false
    }
  }
);