import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Modal from 'react-native-modal';
import styled from 'styled-components';
import AuthInput from '../components/AuthInput';
import useInput from '../hooks/useInput';
import { ActivityIndicator } from "react-native";
import { useMutation } from 'react-apollo-hooks';
import { gql } from "apollo-boost";
import { FEED_QUERY } from './tabs/Home';
const Button = styled.TouchableOpacity`
    background-color:whitesmoke;
    justifyContent: center
    align-items: center
    height: 40px
    border-radius:5px
    `
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
const EDIT_POST = gql`
  mutation editPost(
    $id : String!,
  $caption:String!
  ) { editPost(
    id: $id,
     caption: $caption) 
  }
`;

const DELETE_POST = gql`
  mutation deletePost(
    $id : String!
  ) { 
    deletePost(id: $id ) 
  }
`;

export default ({ id, copyCaption, setCopyCaption }) => {
    const toggleModal = () => { setModalVisible(!isModalVisible) };
    const [isModalVisible, setModalVisible] = useState(false);
    const toggleInput = () => { setInputUp(!inputUp) }
    const [inputUp, setInputUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const captionInput = useInput(copyCaption);
    const [deletePostMutation] = useMutation(DELETE_POST,
        { variables: { id } });
    const [editPostMutation] = useMutation(EDIT_POST,
        {
            variables: { id, caption: captionInput.value },
            refetchQueries: [{ query: FEED_QUERY }]
        });

    const editSubmit = async () => {
        setCopyCaption(captionInput.value)
        setLoading(true)
        await editPostMutation();
        setLoading(false)
        toggleInput()
        toggleModal()
    }
    const deletePost = async () => {
        setLoading(true)
        await deletePostMutation();
        setLoading(false)
        toggleModal()
    }
    return (
        <View style={{ flex: 1 }}>
            <Text onPress={toggleModal} style={{ fontWeight: "bold", fontSize: 20, marginLeft: "auto" }}>...</Text>
            <Modal isVisible={isModalVisible}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ marginBottom: 10, width: 100 }}>
                        <Button onPress={toggleInput}>
                            {loading ? <ActivityIndicator color={"black"} /> : <Text style={{ color: "black", fontWeight: "bold" }}>수정</Text>}
                        </Button>
                    </View>
                    <View style={{ marginBottom: 10, width: 100 }}>
                        <Button onPress={deletePost}>
                            {loading ? <ActivityIndicator color={"black"} /> : <Text style={{ color: "black", fontWeight: "bold" }}>삭제</Text>}
                        </Button>
                    </View>
                    <View style={{ marginBottom: 10, width: 100 }}>
                        <Button onPress={toggleModal}>
                            {loading ? <ActivityIndicator color={"black"} /> : <Text style={{ color: "black", fontWeight: "bold" }}>취소</Text>}
                        </Button>
                    </View>
                </View >
            </Modal >

            <Modal isVisible={inputUp}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ marginBottom: 10 }}>
                        <AuthInput placeholder={"Caption"} value={captionInput.value} onChange={captionInput.onChange} />
                    </View>
                    <View style={{ marginBottom: 10, flexDirection: "row" }}>
                        <InputButton onPress={editSubmit}>
                            {loading ? <ActivityIndicator color={"black"} /> : <Text style={{ color: "black", fontWeight: "bold" }}>수정</Text>}
                        </InputButton>
                        <InputButton onPress={toggleInput}>
                            {loading ? <ActivityIndicator color={"black"} /> : <Text style={{ color: "black", fontWeight: "bold" }}>취소</Text>}
                        </InputButton>
                    </View>

                </View >
            </Modal >
        </View >
    );

}