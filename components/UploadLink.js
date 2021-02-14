import React from "react";
import styled from "styled-components/native";
import { withNavigation } from "react-navigation";
import { Platform } from "react-native";
import styles from "../styles";
import { MaterialIcons } from '@expo/vector-icons'; 

const Container = styled.TouchableOpacity`
  padding-right: 20px;
`;

const Text = styled.Text`
  color: ${styles.navyColor};
  font-weight: 600;
  font-size:15px;
`;

export default withNavigation(({ navigation }) => {
  let navigationName;
  if (navigation.getParam("profile")) {
    navigationName = "PUpload";
  } else if (navigation.getParam("story")) {
    navigationName = "StoryUpload";
  }else {
    navigationName = "Upload";
  }
  return(
  <Container onPress={() => navigation.navigate(navigationName, { photo: navigation.getParam("photo") })}>
    <Text>Next</Text>
  </Container>)
});
