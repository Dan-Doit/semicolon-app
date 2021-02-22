import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { withNavigation } from "react-navigation";
import PropTypes from "prop-types";
import constants from "../Constants";

const RandomSquare = ({ navigation, files = [], id, index }) => {
    let action = "big"

    if (index % 8 === 0) {
        action = "big"
    } else if (index % 8 === 1) {
        action = "long"
    } else { 
        action = "small"
    }
    return (<TouchableOpacity onPress={() => navigation.navigate("Detail", { id })}>
        {action === "big" && <Image
            source={{ uri: files[0].url }}
            style={{ width: (constants.width - 5) / 1.5, height: (constants.width - 8) / 1.5, marginLeft: 2, marginTop: 2 }}
        />}
        {action === "long" && <Image
            source={{ uri: files[0].url }}
            style={{ width: (constants.width - 8) / 3, height: (constants.width - 8) / 1.5, marginLeft: 2, marginTop: 2}}
        />}
        {action === "small" && <Image
            source={{ uri: files[0].url }}
            style={{ width: (constants.width - 8) / 3, height: (constants.width - 8) / 3, marginLeft: 2, marginTop: 2}}
        />}
    </TouchableOpacity>
    )
};

RandomSquare.propTypes = {
    files: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired
        })
    ).isRequired,
    id: PropTypes.string.isRequired
};

export default withNavigation(RandomSquare);