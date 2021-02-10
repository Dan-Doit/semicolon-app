import React, {useState, useEffect} from "react";
import styled from "styled-components/native";
import { gql } from "apollo-boost";
import Loader from "../../components/Loader";
import { useQuery,useMutation } from "react-apollo-hooks";
import { ScrollView, RefreshControl } from "react-native";
import Post from "../../components/Post";
import { POST_FRAGMENT } from "../../Fragments";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

export const MO_TOKEN = gql`
  mutation editMoToken($moToken:String!) {
    editMoToken(moToken:$moToken)
  }
`


export const FEED_QUERY = gql`
  {
    seeFeed {
      ...PostParts
    }
    me{
      id
      username
    }
  }
  ${POST_FRAGMENT}
`;

export default () => {
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
      }
    >
      {loading ? (<Loader />
      ) : (
          data &&
          data.seeFeed &&
          data.seeFeed.map(post => <Post key={post.id} {...post} me={data.me} />)
        )}
      </ScrollView>
  );
};