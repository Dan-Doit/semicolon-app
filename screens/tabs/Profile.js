import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../../Fragments";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import UserProfile from "../../components/UserProfile";
import styled from "styled-components/native";

export const ME = gql`
  {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
    const { loading, data, refetch } = useQuery(ME, {
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
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      {loading ? <Loader /> : data && data.me && <UserProfile {...data.me} navigation={navigation}/>}
    </ScrollView>
  );
};