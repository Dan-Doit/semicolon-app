import React, {useState, useEffect} from "react";
import styled from "styled-components/native";
import { gql } from "apollo-boost";
import Loader from "../../components/Loader";
import { useQuery,useMutation } from "react-apollo-hooks";
import { ScrollView, RefreshControl, View, Text, StyleSheet } from "react-native";
import Post from "../../components/Post";
import { POST_FRAGMENT } from "../../Fragments";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import { Thumbnail } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';
import StoryUp from "../story/StoryUp";
import StoryMenu from "../story/StoryMenu";

export const MO_TOKEN = gql`
  mutation editMoToken($moToken:String!) {
    editMoToken(moToken:$moToken)
  }
`;

export const FEED_QUERY = gql`
  {
    seeFeed {
      ...PostParts
    }
    me {
      id
      username
      avatar
      stories {
        id
        state
        files{
          id
          url
        }
      }
    }
    feedStories {
      id
      avatar
      username
    }
  }
  ${POST_FRAGMENT}
`;


const Story = styled.TouchableOpacity`
`;


export default ({ navigation }) => {
  
  let localStyles = styles()
  const [detailUp, setDetailUp] = useState(false);
  const [menuUp, setMenuUp] = useState(false);
  const [nowId, setNowId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch } = useQuery(FEED_QUERY);

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
  
  const [notificationStatus, setStatus] = useState(false);
  const ask = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    setStatus(status);
    let token = await Notifications.getExpoPushTokenAsync();
    Notifications.setBadgeCountAsync(0)
    
    MoTokenMutation({
    variables: {
    moToken: token.data
      }
    })
  };
  const [MoTokenMutation] = useMutation(MO_TOKEN);

  useEffect(() => { 
    ask();
  },[])
  
 return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }>

      {
        loading ?
          (<Loader />)
          :
          (<>
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

                  {data &&
                    data.me &&
                    data.me.stories[0] ?
                    <Story 
                    onPress={() => {
                        setNowId(data.me)
                        setDetailUp(!detailUp)
                  }}
                      onLongPress={() => {
                      setNowId(data.me)
                      setMenuUp(!menuUp)
                    }}>
                      {detailUp ? < StoryUp userInfo={nowId} detailUp={detailUp} setDetailUp={setDetailUp} /> : null}
                      <LinearGradient start={[1, 0.5]}
                        end={[0, 0]}
                        colors={['#e3179e', 'tomato', 'orange', 'yellow']}
                        style={localStyles.linearGradient}>
                        <View style={localStyles.button}>
                          <Thumbnail style={{ marginHorizontal: 'auto', borderColor: 'white', borderWidth: 2 }} source={{ uri: data.me.avatar }} />
                        </View>
                      </LinearGradient>
                      <Text style={{ textAlign: 'center', marginTop: 5 }}>내 스토리</Text>
                    </Story>
                    :
                    <Story onPress={() => navigation.navigate("TakeStory")}>
                      <LinearGradient start={[1, 0.5]}
                        end={[0, 0]}
                        colors={['lightgray', 'lightgray']}
                        style={localStyles.linearGradient}>
                        <View style={localStyles.button}>
                          <Thumbnail style={{ opacity: 0.7, marginHorizontal: 'auto', borderColor: 'white', borderWidth: 2 }} source={{ uri: "https://previews.123rf.com/images/siamimages/siamimages1611/siamimages161100055/65441642-add-plus-sign-icon-illustration-design.jpg" }} />
                        </View>
                      </LinearGradient>
                      <Text style={{ color: 'gray', textAlign: 'center', marginTop: 5 }}>내 스토리</Text>
                    </Story>
                  }

                  {data &&
                    data.feedStories &&
                    data.feedStories.map(followings =>
                      <Story onPress={() => {
                        setNowId(followings)
                        setDetailUp(!detailUp)
                      }} >
                        {menuUp ? < StoryMenu userInfo={nowId} menuUp={menuUp} setMenuUp={setMenuUp} /> : null}
                        <LinearGradient start={[1, 0.5]}
                          end={[0, 0]}
                          colors={['#e3179e', 'tomato', 'orange', 'yellow']}
                          style={localStyles.linearGradient}>
                          <View style={localStyles.button}>
                            <Thumbnail style={{ marginHorizontal: 'auto', borderColor: 'white', borderWidth: 2 }} source={{ uri: followings.avatar }} />
                          </View>
                        </LinearGradient>
                        <Text style={{ textAlign: 'center', marginTop: 5 }}>{followings.username}</Text>
                      </Story>
                    )

                  }

                </ScrollView>
              </View>
            </View>

            { data &&
              data.seeFeed &&
             data.seeFeed.map(post => <Post key={post.id} {...post} me={data.me} />)}
          </>
          )
      }
    </ScrollView>
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