import React, {useState, Suspense,useCallback, useEffect } from "react";
import { View, Text, ScrollView, TextInput, KeyboardAvoidingView } from "react-native";
import gql from "graphql-tag";
import { useQuery, useMutation, useSubscription } from "react-apollo-hooks";
import ChatRoom from "./ChatRoom";
import { GET_ROOMS } from "../Rooms";
import { GET_MESSAGES } from "./MessageContainer";
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { FontAwesome,FontAwesome5 } from "@expo/vector-icons";

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
      createdAt
    }
  }
`;

export default ({ roomId, Im, toId, data }) => {

  const [message, setMessage] = useState("");
  const [totalMessage, setTotalMessage] = useState(data);

  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    variables: {
      message,
      roomId,
      toId
      }, refetchQueries: [{
          query: GET_MESSAGES, variables: {
          roomId
          }
      }, { query: GET_ROOMS }]
  });

    const { data: notificateMsg } = useSubscription(NEW_MESSAGE, {
        variables: {
            roomId
        }
    });
  
    
    useEffect(() => { 
        handleMessage();
    },[notificateMsg])
    
    const onSend = async (messages) => {
        console.log("????????????????????"+messages[0].text)
        if (message === "") {
            return;
        }
        try {
            setMessage(messages[0].text);
            await sendMessageMutation();
        } catch (e) {
            console.log(e);
        }
    };
    
    
    const handleMessage = () => { 
      if (notificateMsg !== undefined) {
        setTotalMessage([...totalMessage,notificateMsg.notificateMsg]);
      }
    }
        

    const into = totalMessage.map((data, index) => {
        const m = {
            _id: index,
            text: data.text,
            createdAt: data.createdAt,
            user: {
                _id: data.from.id,
                name: data.from.username,
                avatar: data.from.avatar,
            },
        }
        return m;
    });

    const [messages, setMessages] = useState(into.reverse() || []);

    useEffect(() => {
    setMessages(into)
    }, [])

        const renderSend = (props) => { 
        return (
            <Send {...props}>
                <View>
                    <FontAwesome name="send" size={24} color="#364152" style={{marginBottom:10, marginRight:25}}/>
                </View>
            </Send>
        )
    }  
  const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#364152'
                    },
                    left: {
                        backgroundColor:'#ffffff'
                    }
                }}
                textStyle={{
                    right: {
                        color: '#ffffff'
                    }
                }}
            />
    );
}

    const scrollToBottomComponent = () => { 
        return (
            <FontAwesome5 name="angle-double-down" size={24} color="black" />
        )
    }
    
    return (
    <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
              _id: Im,
          }}
          renderBubble={renderBubble}
          alwaysShowSend
          renderSend={renderSend}
          scrollToBottom
          scrollToBottomComponent={scrollToBottomComponent}
    />
  )
}
