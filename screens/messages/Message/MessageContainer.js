import React, { useState, useEffect } from "react";
import gql from "graphql-tag";
import Loader from "../../../components/Loader";
import MessagePresenter from "./MessagePresenter";
import { useQuery, useMutation } from "react-apollo-hooks";
import { GET_ROOMS } from "../Rooms/RoomsContainer";
import { ME } from "../../../Fragments";

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
      room{
        id
      }
      id
      text
    }
  }
`;

export default ({ navigation }) => {

  const roomInfo = navigation.getParam("roomInfo");

  if (roomInfo.roomId !== "needNewRoom") {

    const { roomId, Im, toId, myName } = roomInfo;
    const { data, loading } = useQuery(GET_MESSAGES, {
      variables: {
        roomId
      }
    });
    return (
      loading ? <Loader /> : (<MessagePresenter roomId={roomId} Im={Im} toId={toId} data={data.getMessages} myName={myName} />)); 

  } else { 

    const [loading, setLoading] = useState(true);
    const [roomId, setRoomId] = useState(null);
    const { Im, toId, myName } = roomInfo;
    const [messageMutation] = useMutation(SEND_MESSAGE, {
      variables: {
        toId,
        message: "첫번째 메세지에요!"
      }, refetchQueries: [{ query:ME, query: GET_ROOMS }]
    });

    const insert = async () => {
      const { data } = await messageMutation();
      setRoomId(data.sendMessage.room.id);
      setLoading(!loading);
    }

    useEffect(() => { 
      insert();
    }, [])

    return loading ? <Loader /> : (
      <MessagePresenter roomId={roomId} Im={Im} toId={toId} data={[]} myName={myName} />
    ); 

  }
}

