import React, { useState } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";
import styles from "../styles";
import { Platform } from "@unimodules/core";
import constants from "../Constants";
import SquarePhoto from "./SquarePhoto";
import Post from "./Post";
import { useLogOut } from "../AuthContext";
import EditProfile from "./EditProfile";
import { useMutation } from "react-apollo-hooks";
import { gql } from "apollo-boost";
import { ME } from "../screens/tabs/Profile";
import { FEED_QUERY } from "../screens/home/Home";

const ProfileHeader = styled.View`
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const NameContainer = styled.View`
  padding-vertical: 5px;
  margin-top: -10px;
  width:${constants.width / 2.2}
  height :${constants.height / 10};
`;

const Text = styled.Text`
margin-top : 5px;
  color: black;
  text-align: center;
  font-weight: 600;
`;


const FOLLOW = gql`
  mutation follow($id: String!) {
    follow(id: $id)
  }
`;

const UNFOLLOW = gql`
  mutation unfollow($id: String!) {
    unfollow(id: $id)
  }
`;


const UserNotification = ({
  id,
  avatar,
  postsCount,
  followersCount,
  followingCount,
  bio,
  posts,
  navigation,
  isFollowing,
  isSelf,
  username,
  firstName,
  lastName,

}) => {
  console.log(username);
  const [isGrid, setIsGrid] = useState(true);

    const [isFollowingS, setIsFollowing] = useState(isFollowing);
    const [followMutation] = useMutation(FOLLOW, {
        variables: { id },
        refetchQueries: [{ query: ME, query: FEED_QUERY }]
    });
    const [unfollowMutation] = useMutation(UNFOLLOW, {
        variables: { id },
        refetchQueries: [{ query: ME, query: FEED_QUERY }]
    });

    const Following = async () => {
        if (isFollowingS === true) {
            setIsFollowing(false);
            unfollowMutation();
        } else {
            setIsFollowing(true);
            followMutation();
        }
    };
  return (
    <View>
      <ProfileHeader>
        <Image
          style={{ height: 40, width: 40, borderRadius: 20 }}
          source={{ uri: avatar }}
        />
        <Text>{username}님이 회원님의 게시물에 좋아요를 눌렀습니다.</Text>      
        <TouchableOpacity onPress={Following}>
            {isFollowingS ? <Text>UnFollow</Text> : <Text>Follow</Text>}
        </TouchableOpacity>

        </ProfileHeader>
      </View>
  ) 
};

UserNotification.propTypes = {
  id: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  isFollowing: PropTypes.bool.isRequired,
  isSelf: PropTypes.bool.isRequired,
  bio: PropTypes.string.isRequired,
  followingCount: PropTypes.number.isRequired,
  followersCount: PropTypes.number.isRequired,
  postsCount: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  )
};
export default UserNotification;