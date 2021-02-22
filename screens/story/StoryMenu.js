import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback,Text,ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { useMutation } from 'react-apollo-hooks';
import { gql } from "apollo-boost";
import { FEED_QUERY } from '../home/Home';
import constants from "../../Constants";
import styled from 'styled-components';

const HIDE_STORY = gql`
  mutation hideStory(
    $id: String!,
  ) { hideStory(
    id: $id,
    ) 
  }
`;

const InputButton = styled.TouchableOpacity`
    background-color:white;
    justifyContent: center
    align-items: center
    height: 40px
    width:100px
    margin-right:5px
    margin-left:5px
    border-radius:5px
    `

export default ({ userInfo, menuUp, setMenuUp }) => {
    const [loading, setLoading] = useState(false);

    const [hideStoryMutation] = useMutation(HIDE_STORY,
        { variables: { id:userInfo.id }, refetchQueries: [{ query: FEED_QUERY }] });

    const hideStory = async () => {
        setLoading(true);
        await hideStoryMutation();
        setLoading(false);
        setMenuUp(!menuUp);
    }

    return (
              <TouchableWithoutFeedback onPress={() => setMenuUp(!menuUp)}>
                <Modal animationType="slide" visible={menuUp}>
                  <View style={styles.modalView}>

                        <View style={{ marginBottom: 10}}>
                          <InputButton onPress={hideStory}>
                            {loading ? <ActivityIndicator color={"black"} /> : 
                            <Text style={{ color: "black", fontWeight: "bold" }}>삭제</Text>}
                          </InputButton>
                        </View>

                        <View >
                          <InputButton onPress={() => {
                            setMenuUp(!menuUp)}}>
                            {loading ? <ActivityIndicator color={"black"} />
                             : <Text style={{ color: "black", fontWeight: "bold" }}>취소</Text>}
                          </InputButton>
                        </View>

                  </View >
                </Modal >
                            
               </TouchableWithoutFeedback>

    )
                          }
    const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
    modalView: {
        marginLeft: -constants.width / 7,
        width: constants.width * 1.2,
        height: constants.height,
        backgroundColor: "rgba(0,0,0,0.9)",
        alignItems: "center",
        justifyContent: 'center'
    }
});