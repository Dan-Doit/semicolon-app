import React, {useState, Suspense, useEffect } from "react";
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView } from "react-native";
import gql from "graphql-tag";
import Loader from "../../components/Loader";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import { SafeAreaView } from "react-native";
import { MessageBubble } from "./MessageBubble";

const GET_MESSAGES = gql`
  query getMessages($roomId : String!) {
    getMessages(roomId:$roomId){
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

const NEW_MESSAGE = gql`
  subscription notificateMsg($roomId:String!){
    notificateMsg(roomId:$roomId) {
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

export default ({ navigation }) => {
  const roomInfo = navigation.getParam("roomInfo");
  const [message, setMessage] = useState("");
  const [roomId, setRoomId] = useState(roomInfo.roomId)

  const onChangeText = text => setMessage(text);

  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    variables: {
      message,
      roomId,
      toId: roomInfo.toId
    }
    // , refetchQueries: [{
    //   query: GET_MESSAGES, variables: {
    //   roomId
    // }}]
  });

  const { data: { getMessages : oldMessages }, loading, error } = useQuery(GET_MESSAGES, {
    variables: {
      roomId
    }
  });

  const { data: notificateMsg } = useSubscription(NEW_MESSAGE, {
    variables: {
      roomId
    }
  })

  const [totalMessage, setTotalMessage] = useState(oldMessages || []);

  const handleMessage = () => { 
    if (notificateMsg !== undefined) {
      setTotalMessage([...totalMessage,notificateMsg.notificateMsg]);
    }
  }

  useEffect(() => { 
    handleMessage();
  },[notificateMsg])
  
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
    loading ? <Loader /> : 
      <KeyboardAvoidingView style={{ flex: 1 }} enabled behavior="padding">
      {/* <SafeAreaView> */}
      <ScrollView
        contentContainerStyle={{
          paddingVertical: 50,
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center"
          }}
      >
          {/* {totalMessage.map((message) => {
          return(
            <View key={message.id} style={{marginBottom:15}}><Text>{message.text}</Text></View>
          )
        })} */}
          <MessageBubble text='안녕' />
          
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
      {/* </SafeAreaView> */}
    </KeyboardAvoidingView >
  );
}
