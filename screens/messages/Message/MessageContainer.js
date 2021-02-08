import React from "react";
import gql from "graphql-tag";
import Loader from "../../../components/Loader";
import MessagePresenter from "./MessagePresenter";
import { useQuery,useMutation } from "react-apollo-hooks";

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

const SEND_MESSAGE = gql`
  mutation sendMessage($message: String! $roomId:String $toId:String!) {
    sendMessage(message: $message roomId:$roomId toId:$toId) {
      id
      text
    }
  }
`;

export default ({ navigation }) => {
  
  if (navigation.getParam("roomInfo").roomId === undefined) {
    const { Im, toId } = navigation.getParam("roomInfo");
    const { data, loading } = useMutation(SEND_MESSAGE, {
      variables: {
        toId,
        message: "첫번째 메세지에요!"
      }
    });
    console.log("aaaa")

  return loading ? <Loader /> : (<MessagePresenter roomId={data.id} Im={Im} toId={toId} data={[]} />); 

  } else { 
    const { roomId, Im, toId } = navigation.getParam("roomInfo");
    const { data, loading } = useQuery(GET_MESSAGES, {
      variables: {
        roomId
      }
    });
    return (
    loading ? <Loader /> : (<MessagePresenter roomId={roomId} Im={Im} toId={toId} data={data.getMessages} />)); 
  }


}
