import React, { useState, useCallback, useEffect } from 'react'
import { View } from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat'
import { FontAwesome,FontAwesome5 } from "@expo/vector-icons";

export default function (into,Im,onSend) {
    const [messages, setMessages] = useState(into.reverse() || []);

  useEffect(() => {
    setMessages(into)
  }, [])

//   const onSend = useCallback((messages = []) => {
//     setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
//   }, [])
    
    
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