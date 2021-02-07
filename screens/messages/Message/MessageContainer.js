import React from "react";
import gql from "graphql-tag";
import Loader from "../../../components/Loader";
import MessagePresenter from "./MessagePresenter";
import { useQuery } from "react-apollo-hooks";

export const GET_MESSAGES = gql`
  query getMessages($roomId : String!) {
    getMessages(roomId:$roomId){
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
`;

export default ({ navigation }) => {
  const { roomId, Im, toId } = navigation.getParam("roomInfo");

  const { data, loading } = useQuery(GET_MESSAGES, {
    variables: {
      roomId
    }
  });

  return (
    loading ? <Loader /> : 
        (
              <MessagePresenter roomId={roomId} Im={Im} toId={toId} data={data.getMessages} />       
       )
  );
}
