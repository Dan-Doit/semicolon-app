import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import constants from "../Constants";

const SquarePhoto = ({ navigation, files = [], id }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}>
        <Image
      source={{ uri: files[0].url }}
      style={{ width: (constants.width - 8) / 3, height: (constants.width - 8) / 3 ,marginLeft:2, marginTop:2}}
      
        />
    </TouchableOpacity>
);

SquarePhoto.propTypes = {
    files: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        })
    ).isRequired,
    id: PropTypes.string.isRequired
};

export default withNavigation(SquarePhoto);