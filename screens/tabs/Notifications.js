import React, { useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { gql } from "apollo-boost";
import { USER_FRAGMENT } from "../../Fragments";
import Loader from "../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import UserNotification from "../../components/UserNotification";

export const GET_NOTIFICATION = gql`
{
  getNotificate {
    id
    to{
      id
      username
    }
    from {
      id
      username
      avatar
    }
    post {
      id
    }
    message {
      id
    }
    createdAt
  }
  getFollowing{
    id
  }
}
`;

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
    const { loading, data, refetch } = useQuery(GET_NOTIFICATION, {
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
    <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={refresh} />
      }>
      {loading ? <Loader /> : data && <UserNotification Notifications={data} navigation={navigation}/>}
    </ScrollView>
  );
};