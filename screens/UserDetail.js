import React, { useState } from "react";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../Fragments";
import Loader from "../components/Loader";
import { ScrollView, RefreshControl } from "react-native";
import UserProfile from "../components/UserProfile";

export const GET_USER = gql`
  query seeUser($username: String!) {
    seeUser(username: $username) {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;

export default ({ navigation }) => {
    const [refreshing, setRefreshing] = useState(false);
  const { loading, data, refetch  } = useQuery(GET_USER, {
    variables: {
      username: navigation.getParam("username") }
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
      {loading ? (
        <Loader />
      ) : (
        data && data.seeUser && <UserProfile {...data.seeUser} />
      )}
    </ScrollView>
  );
};