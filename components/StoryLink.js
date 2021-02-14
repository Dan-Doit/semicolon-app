import React from "react";
import styled from "styled-components/native";
import { withNavigation } from "react-navigation";
import { Platform } from "react-native";
import { Feather } from '@expo/vector-icons';


const Container = styled.TouchableOpacity`
  padding-left: 10px;
`;

export default withNavigation(({ navigation }) => (
  <Container onPress={() => navigation.navigate("StoryNavigation", {story : "gotstory"})}>
    <Feather name="camera" size={26} color="black" />
  </Container>
));