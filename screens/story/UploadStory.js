import React, { useState } from "react";
import axios from "axios";
import { Image, ActivityIndicator, Alert, Platform } from "react-native";
import styled from "styled-components/native";
import constants from "../../Constants";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { FEED_QUERY } from "../home/Home";
import { ME } from "../tabs/Profile";

const UPLOADSTORY = gql`
  mutation uploadStory($files: String,$type: String) {
    uploadStory(files: $files, type: $type) {
      id
      caption
    }
  }
`;

const View = styled.View`
  flex: 1;
`;

const Container = styled.View`
  flex-direction: row;
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.navyColor};
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  marginLeft :  ${constants.width/9}
  width : ${constants.width/3}
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;

const Confirm = styled.Text`
  color: black;
  font-weight: 600;
  textAlign : center
  margin-top : ${constants.height/5}
  margin-bottom : 30
`;

export default ({ navigation }) => {
  const [loading, setIsLoading] = useState(false);
  const uri = navigation.getParam("uri");

  const [uploadMutation] = useMutation(UPLOADSTORY, {
    refetchQueries: () => [{ query: FEED_QUERY }, { query: ME }]
  });

  let imageType; // 사진인지 비디오인지 정하는 변수
  let uploadUri; // 비디오는 사진과 가져오는 uri가 달라서 구분해 줘야함.
  let imgUri; // 원안에 들어갈때 뜨는 사진
  let name; // 파일명
  let fileType; // 파일 타입

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

      await uploadMutation({
        variables: {
          files: locationArray[0],
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

        <View>
        <Image
          source={{ uri: imgUri }}
          style={{ height: constants.height/1.5, width: constants.width, marginTop:-26,resizeMode:"contain" }}
        />
        </View>

        <View>
          <Confirm>
        업로드 하시겠습니까 ?
          </Confirm>
          <Container>
        <Button onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
                <Text>확인</Text>
              )}
          </Button>
          <Button onPress={()=> navigation.navigate("Home")}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
                <Text>취소</Text>
              )}
          </Button>
          </Container>
        </View>

    </View>
  );
};