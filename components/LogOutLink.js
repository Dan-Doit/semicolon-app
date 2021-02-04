import React from "react";
import styled from "styled-components/native";
import { withNavigation } from "react-navigation";
import { Platform } from "react-native";
import NavIcon from "./NavIcon";
import { useLogOut } from "../AuthContext";

const Container = styled.TouchableOpacity`
  padding-right: 20px;
`;

export default withNavigation(({ navigation }) => (
    <Container onPress={() => useLogOut()}>
    <NavIcon
      name={Platform.OS === "ios" ? "ios-paper-plane" : "md-paper-plane"}
    />
  </Container>
));