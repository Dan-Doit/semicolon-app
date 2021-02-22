import { gql } from "apollo-boost";

export const POST_FRAGMENT = gql`
  fragment PostParts on Post {
    id
    location
    caption
    hashes {
      id
      tag
    }
    user {
      id
      isSelf
      avatar
      username
    }
    files {
      id
      url
    }
    likeCount
    isLiked
    comments {
      id
      text
      user {
        avatar
        id
        username
        isSelf
      }
    }
    createdAt
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserParts on User {
    id
    avatar
    username
    fullName
    firstName
    lastName
    state
    isFollowing
    isSelf
    bio
    rooms {
      id
      participants{
        id
      }
    }
    following{
      id
      username
      avatar
    }
    followingCount
    followersCount
    postsCount
    posts {
      ...PostParts
    }
  }
  ${POST_FRAGMENT}
`;

export const ME = gql`
  {
    me {
      ...UserParts
    }
  }
  ${USER_FRAGMENT}
`;