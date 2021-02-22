import React, { useState } from "react";
import Loader from "../../../components/Loader";
import { useQuery } from "react-apollo-hooks";
import { ScrollView, RefreshControl } from "react-native";
import RoomsPresenter from "./RoomsPresenter";
import SendChatPresenter from "./SendChatPresenter";
import { gql } from "apollo-boost";
import { ME } from "../../../Fragments";

export const GET_ROOMS = gql`
  {
  seeRooms{
    id
    participants{
      id
      username
      avatar
    }
    messages{
      id
      to{
        id
        username
        avatar
      }
      from{
        id
        username
        avatar
      }
      text
      createdAt
    }
  }
}
`;

export default ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const { data: medata, loading: meloading } = useQuery(ME, {fetchPolicy: 'cache-and-network'});
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
  
  return (meloading ? <Loader /> : (
    loading ? <Loader /> :
      <>
    < SendChatPresenter data={data} medata = { medata } navigation = { navigation } />
    <ScrollView style={{ flex: 0.8 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}>
      <RoomsPresenter data={data} medata={medata} navigation={navigation} />
    </ScrollView>
  </>
    )
  )
};
