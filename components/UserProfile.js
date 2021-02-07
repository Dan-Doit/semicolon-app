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
const HeaderColumn = styled.View``;

const ProfileStats = styled.View`
  flex-direction: row;
`;

const SquareBox = styled.View`
  flex-direction: row;
  flexWrap: wrap;
`;

const Stat = styled.View`
  align-items: center;
  margin-left: 40px;
`;

const Bold = styled.Text`
  font-weight: 600;
`;

const StatName = styled.Text`
  margin-top: 5px;
  font-size: 12px;
  color: ${styles.darkGreyColor};
`;

const ProfileMeta = styled.View`
  margin-top: 10px;
  padding-horizontal: 20px;
`;

const Bio = styled.Text`
  margin-top : 10px;
`;

const ButtonContainer = styled.View`
  padding-vertical: 5px;
  border: 1px solid ${styles.lightGreyColor};
  flex-direction: row;
  margin-top: 30px;
`;


const Button = styled.View`
  width: ${constants.width / 2};
  align-items: center;
`;

const NameContainer = styled.View`
  padding-vertical: 5px;
  margin-top: -10px;
  width:${constants.width / 2.2}
  height :${constants.height / 10};
`;

const Button1 = styled.View`
  margin-top:10px;
  width:90px;
  align-items: center;
  margin-left : ${constants.width / 2.2/4};
  background-color:${styles.navyColor};
  height:30px;
  border-radius: 15px;
`;

const Text = styled.Text`
margin-top : 5px;
  color: white;
  text-align: center;
  font-weight: 600;
`;

const SettingBar = styled.TouchableOpacity`
  width: ${constants.width - 40}
  height: 32px
  backgroundColor: rgba(230,230,230,0.4)
  padding: 5px
  borderRadius: 5px
  margin : auto
  textAlign: center
  border:1px #d6d6d6
`;

const EditText = styled.Text`
  color: #5c5b5b;
  text-align: center;
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

const UserProfile = ({
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
  const [isGrid, setIsGrid] = useState(true);
  const toggleGrid = () => setIsGrid(i => !i);
  const [editProfile, setEditProfile] = useState(false);
  const [userInfo, setUserInfo] = useState({
      username,
      avatar,
      firstName,
      lastName,
      bio,
  });
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
  return (!editProfile ? (
    <View>
      <ProfileHeader>
        <Image
          style={{ height: 80, width: 80, borderRadius: 40 }}
          source={{ uri: avatar }}
        />
        <HeaderColumn>
          <ProfileStats>
            <Stat>
              <Bold>{postsCount}</Bold>
              <StatName>Posts</StatName>
            </Stat>
            <Stat>
              <Bold>{followersCount}</Bold>
              <StatName>Followers</StatName>
            </Stat>
            <Stat>
              <Bold>{followingCount}</Bold>
              <StatName>Following</StatName>
            </Stat>
          </ProfileStats>
        </HeaderColumn>
      </ProfileHeader>
      <ProfileMeta>
        <ProfileStats>
          <NameContainer>
            <Bold>{userInfo.firstName + userInfo.lastName}</Bold>

            <Bio>{userInfo.bio}</Bio>
          </NameContainer>
          <NameContainer>
            {/*                          */}
            <Button1>
              {isSelf ? (<TouchableOpacity onPress={useLogOut()}><Text>로그아웃</Text></TouchableOpacity>)
                :
                (<TouchableOpacity onPress={Following}>
                  {isFollowingS ? <Text>UnFollow</Text> : <Text>Follow</Text>}
                </TouchableOpacity>)}
            </Button1>
            {/*                          */}
          </NameContainer>
        </ProfileStats>
      </ProfileMeta>
      <SettingBar onPress={() => setEditProfile(true)}>
        <EditText>프로필 편집</EditText>
      </SettingBar>
      <ButtonContainer>
        <TouchableOpacity onPress={toggleGrid}>
          <Button>
            <Ionicons
              color={isGrid ? styles.blackColor : styles.darkGreyColor}
              size={32}
              name={Platform.OS === "ios" ? "ios-grid" : "md-grid"}
            />
          </Button>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleGrid}>
          <Button>
            <Ionicons
              color={!isGrid ? styles.blackColor : styles.darkGreyColor}
              size={32}
              name={Platform.OS === "ios" ? "ios-list" : "md-list"}
            />
          </Button>
        </TouchableOpacity>
      </ButtonContainer>
      {isGrid ? <SquareBox>{posts && posts.map(p => {
        return (<SquarePhoto key={p.id} {...p} />)
      })}</SquareBox> : <>
          {posts && posts.map(p => {
            return (<Post key={p.id} {...p} />)
          })}</>}
    </View>) : (
      <EditProfile navigation={navigation} userAvatar={avatar} userInfo={userInfo} setUserInfo={setUserInfo} setEditProfile={setEditProfile} />
    )
  );
};

UserProfile.propTypes = {
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
export default UserProfile;
