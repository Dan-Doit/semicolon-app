import React, { useState } from "react";
import { Image, ActivityIndicator, Alert,Platform } from "react-native";
import styled from "styled-components/native";
import axios from "axios";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { FEED_QUERY } from "../home/Home";
import { ME } from "../tabs/Profile";


const View = styled.View`
  flex: 1;
`;

const Container = styled.View`
  padding: 20px;
`;

const Form = styled.View`
  justify-content: flex-start;
  display: flex;
`;

const Button = styled.TouchableOpacity`
  background-color: ${props => props.theme.navyColor};
  width: 40%;
  margin : auto
  marginTop:30px;
  padding: 10px;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
`;

const Text = styled.Text`
  color: white;
  font-weight: 600;
`;
const EDIT_USER = gql`
    mutation editUser(
        $avatar:String
    )
    {editUser(
    avatar : $avatar
    )
  }`
export default ({ navigation }) => {
  const [loading, setIsLoading] = useState(false);
  const photo = navigation.getParam("photo")
  const [editUserMutation] = useMutation(EDIT_USER);

  const handleSubmit = async () => {

    const formData = new FormData();
      const name = photo[0].filename;
      const [, type] = name.split(".");
    const imageType = Platform.os === "ios" ? type.toLowerCase() : "image/jpeg";
    formData.append("file", {
      name,
      type: imageType,
      uri: photo[0].uri
    });
    try {
      setIsLoading(true)
      const {
        data: { locationArray }
      } = await axios.post("https://semicolon-backend.herokuapp.com/api/upload", formData, {
        headers: {
          "content-type": "multipart/form-data"
        }
      });
      const { data: editUser } = await editUserMutation(
        {
          variables: { avatar: locationArray[0] },
          refetchQueries: [{ query: ME, query: FEED_QUERY }]
        })

      if (editUser) {
        navigation.navigate("Profile")
      }
    } catch (e) {
      console.log(e)
      Alert.alert("Cant Submit", "Try later");
    } finally {
      setIsLoading(false)
    }

  };



  return (
    <View>
      <Container>
        <Image
          source={{ uri: photo[0].uri }}
          style={{ height: 80, width: 80, marginLeft: 120, borderRadius: 40 }}
        />
        <Form>
          <Button onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
                <Text>Submit </Text>
              )}
          </Button>
        </Form>
      </Container>
    </View>
  );
};