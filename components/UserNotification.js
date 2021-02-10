import React, { useState } from "react";
import PropTypes from "prop-types";
import { FlatList } from "react-native";
import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection
} from '../screens/messages/MessageStyles';


const caculateTime = (time) => { 
    if (time !== undefined) {
        const date = new Date();
        const getTime = `${time}`.split('T');
        const days = getTime[0].split('-');
        const times = getTime[1].substring(0, 8).split(':');
        if (date.getFullYear() == days[0]) {
            if (date.getMonth() +1 == days[1]) {
                if (date.getDate() == days[2]) {
                    // plus 10 because UK has different time with KR
                    if (date.getHours() == parseInt(times[0])+9) { 
                        if (date.getMinutes() == times[1]) { 
                                // cv
                             return `${parseInt(date.getSeconds()) - parseInt(times[2])} 초전`
                        }else return `${parseInt(date.getMinutes()) - parseInt(times[1])} 분전`
                    }else return `${parseInt(date.getHours()) - parseInt(times[0])+9} 시간전`
                } else return `${parseInt(date.getDay()) - parseInt(days[2])} 일전`;
            } else return `${parseInt(date.getMonth()+1) - parseInt(days[1])} 달전`;
        } else return `${parseInt(date.getFullYear()) - parseInt(days[0])} 년전`;

    }
    return null;
}


const UserNotification = ({ Notifications }) => {
    
    const Notis = Notifications.getNotificate.map((noti) => {
        if (noti.message === null && noti.from !== null) {
            return {
                id: noti.from.id,
                userName: noti.from.username,
                userImg: noti.from.avatar,
                messageTime: caculateTime(noti.createdAt),
                messageText: `${noti.from.username}님이 나에게 좋아요를 눌렀습니다.`,
                post: null,
                message: null
            }
        } else if (noti.post === null && noti.from !== null) {
            return {
                id: noti.from.id,
                userName: noti.from.username,
                userImg: noti.from.avatar,
                messageTime: caculateTime(noti.createdAt),
                messageText: `${noti.from.username}님이 나에게 메세지를 보냈습니다.`,
                post: null,
                message: null
            }
        } else if (noti.post === null && noti.message === null) {
            return {
                id: noti.from.id,
                userName: noti.from.username,
                userImg: noti.from.avatar,
                messageTime: caculateTime(noti.createdAt),
                messageText: `${noti.from.username}님이 나를 팔로우 하였습니다..`,
                post: null,
                message: null
            }
        }
    });

  return (
    <Container>
            <FlatList
              data={Notis.reverse()}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card onPress={() => navigation.navigate('MessageContainer', {
                        roomInfo:
                        {
                            roomId: item.id,
                            toId: item.toId,
                            userName: item.userName,
                            Im: item.Im
                        }
                    })}
                    >
                        <UserInfo>
                            <UserImgWrapper>
                                <UserImg source={{ uri: item.userImg }} />
                            </UserImgWrapper>
                            <TextSection>
                                <UserInfoText>
                                    <UserName>{item.userName}</UserName>
                                    <PostTime>{item.messageTime}</PostTime>
                                </UserInfoText>
                                <MessageText>{item.messageText}</MessageText>
                            </TextSection>
                        </UserInfo>
                    </Card>
                )}
            />
        </Container>
  ) 
};

export default UserNotification;