import React, { useState } from "react";
import axios from "axios";
import { Image, ActivityIndicator, Alert, Platform } from "react-native";
import styled from "styled-components/native";
import useInput from "../../hooks/useInput";
import styles from "../../styles";
import constants from "../../Constants";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { FEED_QUERY } from "../home/Home";
import { ME } from "../tabs/Profile";

const UPLOADSTORY = gql`
  mutation uploadStory($caption: String, $files: String, $tagUser: [String!],$type : String) {
    uploadStory(caption: $caption, files: $files, tagUser: $tagUser, type: $type) {
      id
      caption
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
  const uri = navigation.getParam("uri");
  const captionInput = useInput();
  const tagUserInput = useInput();

  const [uploadMutation] = useMutation(UPLOADSTORY, {
    refetchQueries: () => [{ query: FEED_QUERY }, { query: ME }]
  });

  let imageType; // 사진인지 비디오인지 정하는 변수
  let uploadUri; // 비디오는 사진과 가져오는 uri가 달라서 구분해 줘야함.
  let imgUri; // 원안에 들어갈때 뜨는 사진
  let name; // 파일명
  let tagUsers; // 태그할 사람들 넣을 변수
  let fileType;
  if (navigation.getParam("photo")) {
    const photo = navigation.getParam("photo");
    fileType = photo.mediaType;
    imgUri = photo.uri;
    name = photo.filename;
    const [, type] = name.split(".");
    uploadUri = photo.uri
    imageType = Platform.os === "ios" ? type.toLowerCase() : "image/jpeg";
  } else if (navigation.getParam("story")) {
    const story = navigation.getParam("story");
    fileType = story.mediaType;
    imgUri = story.uri;
    name = story.filename;
    uploadUri = uri
    imageType = "mp4";
  }
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", {
      name,
      type: imageType,
      uri: uploadUri,
    });

    try {
      setIsLoading(true);
      const { data :{locationArray} } = await axios.post("https://semicolon-backend.herokuapp.com/api/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data', }
      });

      //console.log(tagUserInput.value);

      // if (tagUserInput.value != "" || tagUserInput.value != "undefined" ) {
      //   tagUsers = tagUserInput.value.split(" ");
      // }

      if (tagUserInput.value) {
         tagUsers = tagUserInput.value.split(" ");
      }
      else {
        tagUsers = "";
      }

      await uploadMutation({
        variables: {
          files: locationArray[0],
          caption: captionInput.value,
          tagUser: tagUsers,
          type : fileType
        }
      });

      navigation.navigate("TabNavigation");

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
          source={{ uri: imgUri }}
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
            onChangeText={tagUserInput.onChange}
            value={tagUserInput.value}
            placeholder="태그할 사람"
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