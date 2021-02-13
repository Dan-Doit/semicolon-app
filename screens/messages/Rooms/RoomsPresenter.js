import React from "react";
import { FlatList,Text } from 'react-native';
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
} from '../MessageStyles';

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

export default ({ data, medata, navigation }) => {

    const Rooms = data.seeRooms.map((room) => {
        const me = medata.me.id;
        const myName = medata.me.username;
        const participant = room.participants.filter((person) => me !== person.id)[0]
        const roomNumber = room.messages.length - 1 < 0 ? 0 : room.messages.length - 1
        return {
            id: room.id,
            userName: participant.username,
            userImg: participant.avatar,
            messageTime: caculateTime(room.messages[roomNumber].createdAt),
            messageText: room.messages[roomNumber].text,
            Im: me,
            myName,
            toId: participant.id
        }
    })
  
    return (
        <Container>
            <FlatList
                data={Rooms}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Card onPress={() => navigation.navigate('MessageContainer', {
                        roomInfo:
                        {
                            roomId: item.id,
                            toId: item.toId,
                            userName: item.userName,
                            Im: item.Im,
                            myName: item.myName
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
    );
};
