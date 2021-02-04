import React from 'react';
import styled from "styled-components/native";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import PropTypes from "prop-types";




const Covid = ({ countryName, newCase }) => { 
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons name="virus-outline" size={24} color="black" />
        <Text style={styles.temp}> {countryName} 확진자 {newCase}명</Text>
      </View>
  )
}

export default Covid;

Covid.propTypes = {
  countryName: PropTypes.string.isRequired,
  newCase: PropTypes.string.isRequired,
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