import React, {useState, useEffect } from "react";
import { View } from "react-native";
import gql from "graphql-tag";
import { useMutation, useSubscription } from "react-apollo-hooks";
import { GET_ROOMS } from "../Rooms/RoomsContainer";
import { GET_MESSAGES } from "./MessageContainer";
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export const SEND_NOTIFICATION = gql`
  mutation sendNotificate($username:String! $to:String! $from:String $message:String $post:String $state:String!)
  {
    sendNotificate(username: $username to: $to from: $from message: $message post:$post state:$state)
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
      createdAt
    }
  }
`;

export default ({ roomId, Im, toId, data, myName }) => {

    const [sendMessageMutation] = useMutation(SEND_MESSAGE);
    const { data: notificateMsg } = useSubscription(NEW_MESSAGE, {
        variables: {
            roomId
        }
    });

    const [sendNotificateMutation] = useMutation(SEND_NOTIFICATION, ({
    variables: {
        from: Im,
        to: toId,
        username: myName,
        message:roomId,
        state: "2"
    }
    }));
       
    useEffect(() => { 
        handleMessage();
    }, [notificateMsg])
    
    const onSend = async (messages,roomId,toId) => {

        try {
            const a = messages[0].text;
            const b = roomId;
            const c = toId;
            await sendMessageMutation({
            variables: {
            message:a,
            roomId:b,
            toId:c
            }, refetchQueries: [{
                query: GET_MESSAGES, variables: {
                roomId
                }
            }, { query: GET_ROOMS }]
            });
            
        } catch (e) {
            console.log(e);
        }
    };
    
    const handleMessage = async () => { 

        if (notificateMsg !== undefined) {
            const init = {
            _id: messages.length+1,
            text: notificateMsg.notificateMsg.text,
            createdAt: notificateMsg.notificateMsg.createdAt,
            user: {
                _id: notificateMsg.notificateMsg.from.id,
                name: notificateMsg.notificateMsg.from.username,
                avatar: notificateMsg.notificateMsg.from.avatar,
            },
            }  
            setMessages([init, ...messages])
            await sendNotificateMutation();
      }
    }
        

    const into = data.map((data, index) => {
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
        messages
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
          key={messages.id}
          messages={messages}
          onSend={messages => onSend(messages,roomId,toId)}
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
