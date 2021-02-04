import React, { useState , useEffect } from "react";
import styled from "styled-components/native";
import Weather from "../../components/Weather"; 
import Covid from "../../components/Covid";
import constants from "../../Constants";
import { StyleSheet } from "react-native";

const Image = styled.Image`
  margin-top : -30px;
  margin-bottom : -30px;
  width: ${constants.width / 3};
`;

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;


export default ({ index,
    countryName,
    newCase,
    weather,
    temp}) => {

    const views = [<Image resizeMode={"contain"} source={require("../../assets/logo.png")} />,
        <Covid countryName={countryName} newCase={newCase} />,
    <Weather weather={weather} temp={temp} />]

    return <View>{views[index]}</View>

};
