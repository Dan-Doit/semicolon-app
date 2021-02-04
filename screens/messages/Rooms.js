import React, { useState , useEffect } from "react";
import { Alert } from 'react-native';
import Loader from "../../components/Loader";
import styled from "styled-components/native";
import { useQuery } from "react-apollo-hooks";
import { gql } from "apollo-boost";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

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

const Text = styled.Text``;

export default () => {
  
  const { data, loading } = useQuery(GET_ROOMS);
  if(!loading) console.log(data)
  
  return ( loading ? Loader : 
    (<View>
      <Text>Rooms</Text>
    </View>
  )
  )};