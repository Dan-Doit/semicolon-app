import React from "react";
import { StyleSheet,ScrollView, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Thumbnail } from 'native-base';
import { Story } from '../MessageStyles';
import { gql } from "apollo-boost";

export const FOLLOWING = gql`
{
  getFollowing{
    id
    username
    avatar
  }
}
`;

export default ({ data, medata, navigation }) => {

  const { me: { following } } = medata;
  const { seeRooms } = data;
    
  const pp = () => { 
    const arr = []
    seeRooms.map((room) => { 
      room.participants.map((participant) => {
        arr.push(participant.id)
      });
    })
    return arr;
  }
  

  const result = following.map((following) => {
    const arr = pp();
    if (arr.includes(following.id) === false) {
      return following;
    }
  });

  let localStyles = styles()
  
  return (
    <>
      <View style={{ height: 100 }}>
        <View style={{ flex: 3, borderBottomWidth: 0.8, backgroundColor: "white", borderBottomColor: 'lightgray' }}>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              alignItems: 'center',
              paddingStart: 5,
              paddingEnd: 5
            }}
            horizontal={true} >
                            
            {result.map((result) => {
              if (result === undefined) return null;
              return (
                <Story onPress={() => navigation.navigate('MessageContainer', {
                  roomInfo:
                  {
                    roomId: "needNewRoom",
                    toId: result.id,
                    userName: result.username,
                    Im: medata.me.id,
                    myName:medata.me.username
                  }
                })}
                >
                  <LinearGradient start={[1, 0.5]}
                    end={[0, 0]}
                    colors={['#e3179e', 'tomato', 'orange', 'yellow']}
                    style={localStyles.linearGradient}>
                    <View style={localStyles.button}>
                      <Thumbnail style={{ marginHorizontal: 'auto', borderColor: 'white', borderWidth: 2 }} source={{ uri: result.avatar }} />
                    </View>
                  </LinearGradient>
                  <Text style={{ textAlign: 'center', marginTop: 5 }}>{result.username}</Text>
                </Story>
              )
            })}
          </ScrollView>
        </View>
      </View>
    </>

  );
};


const gradientMargin = () => {
  const ratio = (1 - gradientRatio(62)) / 2
  return 62 * ratio
}

const gradientRatio = () => {
  return 0.94
}

const styles = () => StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 0,
  },
  linearGradient: {
    borderRadius: 62 / 2,
    width: 62,
    height: 62,
    marginHorizontal: 5
  },
  button: {
    margin: gradientMargin(62),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: (62 / 2) * gradientRatio(62),
    width: 62 * gradientRatio(62),
    height: 62 * gradientRatio(62),
    paddingHorizontal: 1
  },
});