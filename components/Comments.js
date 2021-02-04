import React, { useState } from "react";
import { Image, TextInput, ScrollView, KeyboardAvoidingView } from "react-native";
import styled from "styled-components/native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TouchableOpacity } from "react-native-gesture-handler";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import styles from "../styles";
import useInput from "../hooks/useInput";

const Container = styled.View`
  margin-bottom: 15px;
`;
const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
  background:white;
`;
const Touchable = styled.TouchableOpacity``;

const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;

const Bold = styled.Text`
  font-weight: 700;
`;

const Text = styled.Text`
  font-weight: 300;
`;

const Caption = styled.Text`
`;
const Div = styled.View`
  flex-direction: row;
  padding: 15px;
  flex-direction: row;
  align-items: center;
`;

const ADD_COMMENT = gql`
  mutation addComment($postId: String!, $text: String!) {
    addComment(postId: $postId, text: $text) {
      id
      text
      user {
        username
      }
    }
  }
`;

const Comments = ({
  id,
  user,
  caption,
  comments = [],
  navigation
}) => {
  const [selfComments, setSelfComments] = useState();
  // const [isCommenting, setIsCommenting] = useState(false);
  const commentInput = useInput("");
  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    variables: { postId: id, text: commentInput.value }
  });
  const submitComment = async () => {
    // if (commentInput.value !== "" && isCommenting === false) {
    //   setIsCommenting(true);
    // // }
    // const { which } = event;
    // if (which === 13) {
    //   event.preventDefault();
      try {
        const {
          data: { addComment }
        } = await addCommentMutation();
        setSelfComments([...selfComments, addComment]);
        commentInput.setValue("");
        Keyboard.dismiss();
      } catch {
      } 
    }
  ;

  return (
    <Container>
      <Header>
        <Touchable
          onPress={() => navigation.navigate("UserDetail", { username: user.username })}>
          <Image
            style={{ height: 30, width: 30, borderRadius: 15 }}
            source={{ uri: user.avatar }}
          />
        </Touchable>
        <Touchable onPress={() => navigation.navigate("UserDetail", { username: user.username })}>
          <HeaderUserContainer>
        <Caption>
          <Bold>{user.username}</Bold> {caption}
        </Caption>
          </HeaderUserContainer>
        </Touchable>
      </Header>

      <KeyboardAwareScrollView>
        
      <ScrollView style={{flex: 1, padding:10}} >
          
        {comments.map(comment => (
      
       <Touchable onPress={() => navigation.navigate("UserDetail", { username: comment.user.username })}>
            <Div>
               
            <Image
              style={{ height: 30, width: 30, borderRadius: 15 }}
              source={{ uri: comment.user.avatar }}
            />
            <Bold>{comment.user.username}</Bold>
                 
            <Text> {comment.text}</Text>
  </Div>
        </Touchable>
                
        ))}
   
         <TextInput
            value={commentInput.value}
            onChangeText={commentInput.onChange}
            placeholder={"댓글 달기..."}
            // onChangeText={onChangeText}
            style={{
              marginLeft: 10,
              height: 50,
              backgroundColor: "white",
              width: "95%",
              borderRadius: 10,
            }}
          />
          <TouchableOpacity onPress={() => submitComment()} style={{width: 50}}><Text style={{color: styles.blueColor}}>게시</Text></TouchableOpacity>
          </ScrollView>
      </KeyboardAwareScrollView>
      {/* </KeyboardAvoidingView> */}
      </Container>
        
  )
};

Comments.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        avatar:PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export default withNavigation(Comments);
