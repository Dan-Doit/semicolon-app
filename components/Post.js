import React, { useState, useEffect } from "react";
import { Image, Platform } from "react-native";
import styled from "styled-components/native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import PropTypes from "prop-types";
import Swiper from "react-native-swiper";
import { gql } from "apollo-boost";
import constants from "../Constants";
import styles from "../styles";
import Tags from "react-native-tags";
import { useMutation, useSubscription } from "react-apollo-hooks";
import { withNavigation } from "react-navigation";
import Popup from "../screens/Popup";

export const TOGGLE_LIKE = gql`
  mutation toggelLike($postId: String!) {
    toggleLike(postId: $postId)
  }
`;
export const SEND_NOTIFICATION = gql`
  mutation sendNotificate($username:String! $to:String! $from:String $message:String $post:String $state:String!)
  {
    sendNotificate(username: $username to: $to from: $from message: $message post:$post state:$state)
  }
`;


const Container = styled.View`
  margin-bottom: 15px;
`;
const Header = styled.View`
  padding: 15px;
  flex-direction: row;
  align-items: center;
`;
const Touchable = styled.TouchableOpacity``;
const HeaderUserContainer = styled.View`
  margin-left: 10px;
`;
const Bold = styled.Text`
  font-weight: 500;
`;
const Location = styled.Text`
  font-size: 12px;
`;
const IconsContainer = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
  margin-top : -55px;
`;
const IconContainer = styled.View`
  margin-right: 10px;
`;
const InfoContainer = styled.View`
  padding: 10px;
`;
const Caption = styled.Text`
  margin: 5px 0px;
`;
const CommentCount = styled.Text`
  opacity: 0.5;
  font-size: 13px;
`;

const Tagview = styled.View`
  flex:1;
    flex-direction: row;
    align-items:flex-end;
    justifyContent: flex-end;
`

const Post = ({
  id,
  user,
  hashes,
  location,
  files = [],
  likeCount: likeCountProp,
  caption,
  comments = [],
  isLiked: isLikedProp,
  me,
  navigation
}) => {

  const [isLiked, setIsLiked] = useState(isLikedProp);
  const [likeCount, setLikeCount] = useState(likeCountProp);
  const [copyCaption, setCopyCaption] = useState(caption)
 
  const [toggleLikeMutaton] = useMutation(TOGGLE_LIKE, {
    variables: {
      postId: id
    }
  });

  const [sendNotificateMutation] = useMutation(SEND_NOTIFICATION, ({
    variables: {
    username: me.username,
    to: user.id,
    from: me.id,
    post: `${id},${isLiked}`,
    state: "3"
    }
  }));

  const handleLike = async () => {
    if (isLiked === true) {
      setLikeCount(l => l - 1);
    } else {
      setLikeCount(l => l + 1);
    }
    setIsLiked(p => !p);
    try {
      await sendNotificateMutation();
      await toggleLikeMutaton();

    } catch (e) { 
      console.log(e)
    }
  };

  return (<Container>
      <Header>
        <Touchable
          onPress={() => navigation.navigate("UserDetail", { username: user.username })}>
          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={{ uri: user.avatar }}
          />
        </Touchable>
        <Touchable onPress={() => navigation.navigate("UserDetail", { username: user.username })}>
          <HeaderUserContainer>
            <Bold>{user.username}</Bold>
            <Location>{location}</Location>
        </HeaderUserContainer>
      </Touchable>
      <Tagview>
        {hashes.map(hash => (<Tags
          initialTags={[hash.tag]}
          readonly
          onTagPress={(index, tagLabel) => {
            return navigation.navigate("Tag", { term: tagLabel })
          }}
        />))}
      </Tagview>
      </Header>
      <Swiper style={{ height: constants.width/0.88 }}>
        {files.map(file => (
          <Image
            style={{ width: constants.width, height: constants.width}}
            key={file.id}
            source={{ uri: file.url }}
          />
        ))}
      </Swiper>
      <InfoContainer>
        <IconsContainer>
          <Touchable onPress={handleLike}>
            <IconContainer>
              <AntDesign
                size={24}
                color={isLiked ? styles.starColor : styles.blackColor}
                name={
                  Platform.OS === "ios"
                    ? isLiked
                      ? "star"
                      : "staro"
                    : isLiked
                    ? "star"
                    : "staro"
                }
              />
            </IconContainer>
          </Touchable>
          <Touchable onPress={() => navigation.navigate("CommentDetail", { id })}>
            <IconContainer >
              <FontAwesome
                color={styles.blackColor}
                size={24}
                name={Platform.OS === "ios" ? "comment-o" : "comment-o"}
              />
            </IconContainer>
        </Touchable>
      {user.isSelf ? <Popup id={id} copyCaption={copyCaption} setCopyCaption={setCopyCaption} /> : null}
        </IconsContainer>
        <Touchable>
          <Bold>{likeCount === 1 ? "1 like" : `${likeCount} likes`}</Bold>
        </Touchable>
        <Caption>
          <Bold>{user.username}</Bold> {caption}
        </Caption>
      <Touchable onPress={() => navigation.navigate("CommentDetail", { id })}>

         {comments.length> 0?<CommentCount>댓글 {comments.length}개 더보기</CommentCount>:<CommentCount>첫번째 댓글의 주인공이 되어주세요!</CommentCount>}

        </Touchable>
      </InfoContainer>
      </Container>
  )
};

Post.propTypes = {
  id: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    username: PropTypes.string.isRequired
  }).isRequired,
  files: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  likeCount: PropTypes.number.isRequired,
  isLiked: PropTypes.bool.isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired
      }).isRequired
    })
  ).isRequired,
  caption: PropTypes.string.isRequired,
  location: PropTypes.string,
  createdAt: PropTypes.string.isRequired
};

export default withNavigation(Post);