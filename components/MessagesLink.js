import React from "react";
import styled from "styled-components/native";
import { withNavigation } from "react-navigation";
import { Platform } from "react-native";
import NavIcon from "./NavIcon";
//import { Ionicons } from "@expo/vector-icons";

//import styles from "../styles";
//import { View, TouchableOpacity } from "react-native";
//import { createBottomTabNavigator } from 'react-navigation-tabs';

const Container = styled.TouchableOpacity`
  padding-right: 20px;
`;

export default withNavigation(({ navigation }) => (
  <Container onPress={() => navigation.navigate("MessageNavigation")}>
    <NavIcon
      name={Platform.OS === "ios" ? "ios-paper-plane" : "md-paper-plane"}
    />
  </Container>
));