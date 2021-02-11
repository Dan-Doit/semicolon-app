import React, { useState } from "react";
import styled from "styled-components/native";
import { AntDesign} from "@expo/vector-icons";
import PropTypes from "prop-types";
import { useMutation } from "react-apollo-hooks";
import styles from "../styles";
import { FEED_QUERY } from "../screens/home/Home";
import { COMMENT_LIKE } from "./Comments";


const Touchable = styled.TouchableOpacity`

`;

const CommentPresenter = ({ commentId, isCommented }) => {

    const [CommentLikeMutation] = useMutation(COMMENT_LIKE, {
        variables: {commentId: commentId}, refetchQueries: [{query:FEED_QUERY}]
    })

    const [state, setState] = useState(isCommented);

    const comparing = () => {
        CommentLikeMutation();
        if (state === true) {
            setState(false);
        } else {
            setState(true);
        }
    }
    return <Touchable onPress={comparing}>
                <AntDesign size={16} color={state ? styles.starColor : styles.blackColor} name={state? "star" : "staro"}/>
           </Touchable>
    
}


CommentPresenter.propTypes = {
    isCommented:PropTypes.bool.isRequired,
    commentId: PropTypes.string.isRequired
};

export default CommentPresenter;