import React from 'react';
import styled from "styled-components/native";
import { View, Text, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { Fontisto, MaterialCommunityIcons, FontAwesome5, Feather } from "@expo/vector-icons";

const weatherOptions = {
  Thunderstorm: {
    event: "  요즘 핫한 공포영화 Top3!",
    icon: <MaterialCommunityIcons name="ghost" size={24} color="black" />
  },
  Drizzle: {
    event: "  오늘은 스르륵 낮잠 어때요?",
    icon: <MaterialCommunityIcons name="sleep" size={24} color="black" />
  },
  Rain: {
    event: "  막걸리에 파전어때요?",
    icon: <MaterialCommunityIcons name="beer-outline" size={24} color="black" />
  },
  Snow: {
    event: "  이번겨울은 가자 스키장!",
    icon: <FontAwesome5 name="skiing" size={24} color="black" />
  },
  Atmosphere: {
    event: "  구름 구름 구름~",
    icon: <FontAwesome5 name="cloud" size={24} color="black" />
  },
  Clear: {
    event: "  오늘은 피크닉 어때요?",
    icon: <Fontisto name="parasol" size={20} color="black" />
  },
  Clouds: {
    event: "  우중충 한데 우리 한잔해요",
    icon: <FontAwesome5 name="beer" size={24} color="black" />
  },
  Mist: {
    event: "  미스트 선물 ㄱㄱ",
    icon: <MaterialCommunityIcons name="watering-can" size={24} color="black" />
  },
  Dust: {
    event: "  오늘은 마스크 100장 쏜다",
    icon: <MaterialCommunityIcons name="drama-masks" size={24} color="black" />
  },
  Haze: {
    event: "  우울하니 카페서 라떼 한잔?",
    icon: <Feather name="coffee" size={24} color="black" />
  }
};

const Weather = ({ weather, temp }) => { 

    return (
      <View style={styles.container}>
       {weatherOptions[weather].icon}
        <Text style={styles.temp}>{weatherOptions[weather].event}</Text>
      </View>
    )
}

export default Weather;

Weather.propTypes = {
  weather: PropTypes.string.isRequired,
  temp: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  temp: {
    fontSize: 17,
    fontWeight:'bold',
    color: "black"
  }
});