import React, { useState } from "react";
import axios from "axios";
import { Image, ActivityIndicator, Alert, Platform } from "react-native";
import styled from "styled-components";
import useInput from "../../hooks/useInput";
import styles from "../../styles";
import constants from "../../Constants";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { FEED_QUERY } from "../home/Home";
import { ME } from "../tabs/Profile";
import { GET_USER } from "../UserDetail";

const UPLOAD = gql`
  mutation upload($caption: String!, $files: [String!]!, $location: String) {
    upload(caption: $caption, files: $files, location: $location) {
      id
      caption
      location
    }
  }
`;

const View = styled.View`
  flex: 1;
`;

const Container = styled.View`
  padding: 20px;
  flex-direction: row;
`;

const Form = styled.View`
  justify-content: flex-start;
`;

const STextInput = styled.TextInput`
  margin-bottom: 10px;
  border: 0px solid ${styles.lightGreyColor};
  border-bottom-width: 1px;
  padding-bottom: 10px;
  width: ${constants.width - 180};
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.blueColor};
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

export default ({ navigation }) => {
  const [loading, setIsLoading] = useState(false);
  const photo = navigation.getParam("photo");
  const captionInput = useInput("");
  const locationInput = useInput("");
  const [uploadMutation] = useMutation(UPLOAD, {
    refetchQueries: () => [{ query: FEED_QUERY }, {query:ME}]
  });
  const handleSubmit = async () => {
    if (captionInput.value === "" || locationInput.value === "") {
      Alert.alert("모든 항목을 입력해 주세요.");
    }
    const formData = new FormData();
    const name = photo.filename;
    const [, type] = name.split(".");
    const imageType = Platform.os === "ios" ? type.toLowerCase() : "image/jpeg";
    formData.append("file", {
      name,
      type: imageType,
      uri: photo.uri
    });
    try {
      setIsLoading(true);
      const {
        data: { location }
      } = await axios.post("https://semicolon-backend.herokuapp.com/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data"
        }
      });

      const {
        data: { upload }
      } = await uploadMutation({
          variables: {
            files: [location],
            caption: captionInput.value,
            location: locationInput.value
          }
        });
      if (upload.id) {
        navigation.navigate("TabNavigation");
      }
      
    } catch (e) {
      console.log("에러 " + e);
      Alert.alert("업로드 실패", "다시 시도해 주세요 🤔");
    } finally {
      setIsLoading(false);
    }
    
  };
  return (
    <View>
      <Container>
        <Image
          source={{ uri: photo.uri }}
          style={{ height: 80, width: 80, marginRight: 30 }}
        />
        <Form>
          <STextInput
            onChangeText={captionInput.onChange}
            value={captionInput.value}
            placeholder="글 내용"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          />
          <STextInput
            onChangeText={locationInput.onChange}
            value={locationInput.value}
            placeholder="위치"
            multiline={true}
            placeholderTextColor={styles.darkGreyColor}
          />
          <Button onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text>업로드 </Text>
            )}
          </Button>
        </Form>
      </Container>
    </View>
  );
};