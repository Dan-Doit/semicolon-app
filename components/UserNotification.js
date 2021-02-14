import React, { useState, useEffect } from "react";
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
            if (date.getMonth() + 1 == days[1]) {
                if (date.getDate() == days[2]) {
                    // plus 10 because UK has different time with KR
                    if (date.getHours() == parseInt(times[0])+9) {
                        if (date.getMinutes() == times[1]) { 
                                // cv
                             return `${parseInt(date.getSeconds()) - parseInt(times[2])} 초전`
                        }else return `${parseInt(date.getMinutes()) - parseInt(times[1])} 분전`
                    }else return `${parseInt(date.getHours()) - (parseInt(times[0])+9)} 시간전`
                } else return `${parseInt(date.getDate()) - parseInt(days[2])} 일전`;
            } else return `${parseInt(date.getMonth()+1) - parseInt(days[1])} 달전`;
        } else return `${parseInt(date.getFullYear()) - parseInt(days[0])} 년전`;

    }
    return null;
}

const messageHandler = (id,following) => { 
    const arr = following.map((f) => f.id);
    return(arr.includes(id));
}


const UserNotification = ({ Notifications, navigation }) => {
    const [data, setData] = useState([]);

    useEffect(() => { 
        const Notis = Notifications.getNotificate.map((noti,index) => {
            if (noti.message === null && noti.from !== null && noti.post !== null) {
            return {
                id: `${noti.from.id}${index}`,
                userName: noti.from.username,
                userImg: noti.from.avatar,
                messageTime: caculateTime(noti.createdAt),
                messageText: `${noti.from.username}님이 나에게 좋아요를 눌렀습니다.`,
                post: null,
                message: null,
                state: "Detail",
                roomInfo: {id: noti.post.id}
            }
            
            } else if (noti.post === null && noti.from !== null && noti.message !== null) {
                let into = "";
                let information = {};
                let text = "";
                if (!messageHandler(noti.from.id, Notifications.getFollowing)) {
                    // 프로필로 가기
                    into = "UserDetail";
                    information = { username: noti.from.username }
                    text = `${noti.from.username}님이 대화를 원하고있어요!`;
                } else { 
                    // 메세지로 가기
                    into = "MessageContainer"
                    information = {
                        roomInfo: {
                        roomId: noti.message.id,
                        toId: noti.from.id,
                        userName: noti.from.username,
                        Im: noti.to.id,
                        myName: noti.to.username
                    }
                    }
                    text = `${noti.from.username}님이 나에게 메세지를 보냈습니다.`;
                }

            return {
                id: `${noti.from.id}${index}`,
                userName: noti.from.username,
                userImg: noti.from.avatar,
                messageTime: caculateTime(noti.createdAt),
                messageText: text,
                post: null,
                message: null,
                state:into,
                roomInfo:information
            }
        } else if (noti.post === null && noti.message === null) {
            return {
                id: `${noti.from.id}${index}`,
                userName: noti.from.username,
                userImg: noti.from.avatar,
                messageTime: caculateTime(noti.createdAt),
                messageText: `${noti.from.username}님이 나를 팔로우 하였습니다.`,
                post: null,
                message: null,
                state: "UserDetail",
                roomInfo: {username: noti.from.username}
            }
        }
        });
        setData(Notis)
        return () => {setData([])}
    },[Notifications])
    
    


  return (
    <Container>
            <FlatList
              data={data.reverse()}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card onPress={() => navigation.navigate(item.state, item.roomInfo)}>
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