import React from "react";
import { StyleSheet,ScrollView, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Thumbnail } from 'native-base';
import { Story } from '../MessageStyles';
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";

export const FOLLOWING = gql`
{
  getFollowing{
    following{
        id
    }
  }
}
`;

export default ({ data, navigation }) => {

    const { data: following, loading } = useQuery(FOLLOWING);
    if (!loading) { 
        console.log(loading)
    console.log(following);
    }

    let localStyles = styles()
  
    return (<>
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
                            
                    {data.seeRooms.map((room) => (
                        <Story onPress={() => navigation.navigate('MessageContainer', {
                        roomInfo:
                        {
                            toId: item.toId,
                            userName: item.userName,
                            Im: item.Im
                        }
                        })}
                        >
                            <LinearGradient start={[1, 0.5]}
                                end={[0, 0]}
                                colors={['#e3179e', 'tomato', 'orange', 'yellow']}
                                style={localStyles.linearGradient}>
                                <View style={localStyles.button}>
                                    <Thumbnail style={{ marginHorizontal: 'auto', borderColor: 'white', borderWidth: 2 }} source={{ uri: room.participants[0].avatar }} />
                                </View>
                            </LinearGradient>
                            <Text style={{ textAlign: 'center', marginTop: 5 }}>{room.participants[0].username}</Text>
                        </Story>
                        ))}
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