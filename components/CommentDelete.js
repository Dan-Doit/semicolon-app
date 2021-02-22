import React from 'react'
import {TouchableOpacity,Text,StyleSheet} from 'react-native'
import { FEED_QUERY } from "../screens/home/Home";
import { DELETE_COMMENT } from "./Comments";
import { useMutation } from "react-apollo-hooks";
import PropTypes from "prop-types";
import { EvilIcons, Entypo } from "@expo/vector-icons";

const CommentDelete = ({ setSelfComments, comments, id }) => {

    const [removeCommentMutation] = useMutation(DELETE_COMMENT, {
    variables: { id }, refetchQueries: [{query:FEED_QUERY}]
    });

    const delComment = async () => {
    await removeCommentMutation();
    setSelfComments([...comments].filter(comment => comment.id !== id))
    } 
  return (
        <TouchableOpacity onPress={() => { delComment() }}
            activeOpacity={0.8}
            style={styles.button}
        >
           
         {comments.user.isSelf ? <EvilIcons size={30} name={"trash"} /> : <Entypo name="block" size={30} color="black" /> }
  
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        backgroundColor: '#FE5746',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#FFFFFF'
    }
})

CommentDelete.propTypes = {

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
  )
};


export default CommentDelete;