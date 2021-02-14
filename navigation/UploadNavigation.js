import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import React from "react";
import { createStackNavigator } from 'react-navigation-stack';
import SelectPhoto from "../screens/photo/SelectPhoto";
import styles from '../styles';
import UploadLink from '../components/UploadLink';
import UploadProfile from '../screens/photo/UploadProfile';
import TakeUpload from '../screens/photo/TakeUpload';

const PhotoTabs = createMaterialTopTabNavigator(
    {
        Select: {
            screen: SelectPhoto,
            navigationOptions: {
                tabBarLabel: "Select"
            }
        },
        Take: {
            screen: TakeUpload,
            navigationOptions: {
                tabBarLabel: "Take"
            }
        }

    },
    {
        tabBarPosition: "bottom",
        tabBarOptions: {

            indicatorStyle: {
                backgroundColor: styles.navyColor,
                marginBottom: 48
            },
            labelStyle: {
                fontWeight: "bold"
            },
            style: {
                backgroundColor: styles.searchColor
            }
        }
    }
);

export default createStackNavigator({
    PhotoTabs: {
        screen: PhotoTabs,
        navigationOptions: {
            title: " ",
            headerBackTitle: " ",
            headerTintColor: styles.blackColor,
            headerRight: ()=><UploadLink />
        }
    },
    PUpload: {
        screen: UploadProfile,
        navigationOptions: {
             headerBackTitle: " ",
            headerTintColor: styles.blackColor,
            title: " "
        }
    }
},
    {
        mode: "modal"
    }
);