import React, { useState } from "react";
import { Image, TextInput, ScrollView } from "react-native";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TouchableOpacity } from "react-native-gesture-handler";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { useMutation } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import styles from "../styles";
import useInput from "../hooks/useInput";
import CommentPresenter from "./CommentPresenter";
import { FEED_QUERY } from "../screens/home/Home";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import CommentDelete from './CommentDelete';


const Container = styled.View`
  margin-bottom: 15px;
  flex:1;
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
    
    width: 100%;
    flexDirection: row;
    align-Items: center;
    padding: 7px;
`;
    // 
    // borderBottomWidth:0.6;
const Div2 = styled.View`
  flex:1
  padding: 5px;
  flex-direction: row;
  justify-content: flex-end;
`
const Div3 = styled.View`
    
    width: 100%;
    flexDirection: row;
    alignItems: center;
    padding: 7px;
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



export const COMMENT_LIKE = gql`
  mutation commentLikes($commentId: String!) {
    commentLikes(commentId: $commentId)
  }
`;

export const DELETE_COMMENT = gql`
  mutation deleteComment($id: String!) {
    deleteComment(id: $id) 
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
  const commentInput = useInput("");
  const [addCommentMutation] = useMutation(ADD_COMMENT, {
    variables: { postId: id, text: commentInput.value }, refetchQueries: [{query:FEED_QUERY}]
  });

  const submitComment = async () => {
      try {
        const {
          data: { addComment }
        } = await addCommentMutation();
        // setSelfComments([...selfComments, addComment]);
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

      <KeyboardAwareScrollView  >
        
      <ScrollView style={{flex: 1, padding:10}} >
          
          {comments.map(comment => (
            <Swipeable renderRightActions={() => <CommentDelete id={comment.id} comments={comment} setSelfComments={setSelfComments}   />}>
        <Touchable onPress={() => navigation.navigate("UserDetail", { username: comment.user.username })}>
          <Div>
               
            <Image
              style={{ height: 30, width: 30, borderRadius: 15 }}
              source={{ uri: comment.user.avatar }}
            />
            <Bold>{comment.user.username}</Bold>  
                  <Text> {comment.text}</Text>
            <Div2>
            <CommentPresenter commentId={comment.id} isCommented={comment.isCommented } />
           </Div2>
          </Div>          
        </Touchable>
        </Swipeable>
            
          ))}
         
          <Div3>
            <TextInput
            value={commentInput.value}
            onChangeText={commentInput.onChange}
            placeholder={"  댓글 달기..."}
                 
              style={{      
              marginLeft: 3,
              height: 50,
              backgroundColor: "white",
              width: "87%",
              borderRadius: 15,
              }}
              
              />
              <TouchableOpacity onPress={() => submitComment()} style={{width: 50, left:15}}><Text style={{color: styles.blueColor}}>게시</Text></TouchableOpacity>
            </Div3>

          </ScrollView>
      </KeyboardAwareScrollView>
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