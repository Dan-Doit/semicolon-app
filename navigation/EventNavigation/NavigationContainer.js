import React, { useState , useEffect } from "react";
import * as Location from 'expo-location';
import constants from "../../Constants";
import { Alert } from 'react-native';
import NavigationPresenter from "./NavigationPresenter";
import styled from "styled-components/native";


const Image = styled.Image`
  margin-top : -30px;
  margin-bottom : -30px;
  width: ${constants.width / 3};
  
`;

export default () => {
const [loading, setLoading] = useState(true);
const [location, setLocation] = useState(null);
  
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Woops!","위치정보를 찾을수 없어요!")
        return;
      }

      try {
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();
        const [{ region }]  = await Location.reverseGeocodeAsync({latitude,longitude});
          setLocation({ latitude, longitude, region: region.toLowerCase() });
          setLoading(false);
      } catch (e) {
        console.log(e);
        Alert.alert("위치를 찾을수없어요","위치정보를 켜주세요!")
      }

    })();
  }, []);
    
    return (
        loading ? (<Image resizeMode={"contain"} source={require("../../assets/logo.png")} />) : (<NavigationPresenter location={location} />)
  )};