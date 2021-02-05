import React, {useState, Suspense } from "react";
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView } from "react-native";
import gql from "graphql-tag";
import Loader from "../../components/Loader";
import { useQuery, useMutation } from "react-apollo-hooks";


const GET_MESSAGES = gql`
  query getMessages($RoomId : String) {
    getMessages(RoomId:$RoomId){
      id
      to{
        id
        username
        avatar
      }
      from{
        id
        username
        avatar
      }
      text
    }
}
`;

const SEND_MESSAGE = gql`
  mutation sendMessage($message: String! $roomId:String! $toId:String!) {
    sendMessage(message: $message roomId:$roomId toId:$toId) {
      id
      text
    }
  }
`;

export default ({ navigation }) => {
  const RoomInfo = navigation.getParam("RoomInfo");
  const [message, setMessage] = useState("");
  const [RoomId, setRoomId] = useState(RoomInfo.RoomId)

  const onChangeText = text => setMessage(text);

  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    variables: {
      message,
      roomId: RoomId,
      toId: RoomInfo.ToId
    }, refetchQueries: () => [{ query: GET_MESSAGES }]
  });

  const { data, error } = useQuery(GET_MESSAGES, {
    variables: {
      RoomId
    }
  });
  
  const onSubmit = async () => {
    if (message === "") {
      return;
    }
    try {
      await sendMessageMutation();
      setMessage("");
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <Suspense fallback={<Loader/>}>
      <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="padding">
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 50,
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center"
          }}
      >
        {data.getMessages.map((message)=>{
          return(
            <View key={message.id} style={{marginBottom:15}}><Text>{message.text}</Text></View>
          )
        })}
        <TextInput
        placeholder="Type a message"
        style={{
          marginTop: 50,
          width: "90%",
          borderRadius: 10,
          paddingVertical: 15,
          paddingHorizontal: 10,
          backgroundColor: "#ffffff"
        }}
        returnKeyType="send"
        value={message}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
      />
          </ScrollView>
    </KeyboardAvoidingView >
      </Suspense>
  );
}