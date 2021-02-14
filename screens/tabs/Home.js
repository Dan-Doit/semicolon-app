import React, {useState} from "react";
import styled from "styled-components/native";
import { gql } from "apollo-boost";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import { ScrollView, RefreshControl } from "react-native";
import Post from "../../components/Post";
import { POST_FRAGMENT } from "../../Fragments";

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
    const { loading, data, refetch } = useQuery(FEED_QUERY, {
    fetchPolicy: 'cache-and-network'
  });
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