import React, { useState , useEffect } from "react";
import { Image, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import Loader from "../../components/Loader";
import styled from "styled-components/native";
import { useQuery } from "react-apollo-hooks";
import Constants from "../../Constants";
import { gql } from "apollo-boost";

const GET_ROOMS = gql`
  {
  seeRooms{
    id
    participants{
      id
      username
      avatar
    }
  }
}
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  paddingTop: 40
  flex: 1;
`;

const RoomContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const RoomView = styled.View`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  width:${parseInt(Constants.width*0.8)};
  borderRadius : 50;
  border: 1px solid;
  flex: 0.7;
`;

const ImageWrapper = styled.View`
  borderRadius : 30;
  border: 1px solid;
  flex: 2.5;
`;

const InfoWrapper = styled.View`
  borderRadius : 30;
  border: 1px solid;
  flex: 6;
`;

const Text = styled.Text`
  color: black;
  font-weight: 600;
  font-size:15px;
`;

const Touchable = styled.TouchableOpacity``;


export default ({ navigation }) => {

  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(GET_ROOMS);
  const refresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } catch (e) {
      console.log(e);
    } finally {
      setRefreshing(false);
    }
  };
  
  return (loading ? Loader : 
    (
    <Container>
      <ScrollView style={{ flex: 1, paddingTop:40 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <RoomContainer>
                      {data.seeRooms.map((room) => { 
          return(
              <Touchable key={room.id} onPress={() => navigation.navigate('Message', { RoomInfo: {RoomId : room.id, ToId : room.participants[1].id } })}>
              <RoomView>
                <ImageWrapper>
          <Image
          style={{ height: 80, width: 80, borderRadius: 40 }}
          source={{ uri: room.participants[1].avatar }}
                  />
                </ImageWrapper>
                <InfoWrapper>
            <Text>{room.id}</Text>
                <Text>{room.participants[1].username}</Text>
                  <Text>DM보내기</Text>
                  </InfoWrapper>
          </RoomView>
        </Touchable>)
      })}
    </RoomContainer>
        </ScrollView>
        </Container>
  )
    )
};
