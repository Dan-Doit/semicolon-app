
import React from "react";
import styled from "styled-components/native";
import PropTypes from "prop-types";
import constants from "../Constants";

const Container = styled.View`
  margin-bottom: 10px;
`;

const TextInput = styled.TextInput`
  width: ${constants.width / 1.7};
  padding: 10px;
  background-color: ${props => props.theme.greyColor};
  border: 0.5px solid ${props => props.theme.darkGreyColor};
  border-radius: 4px;
`;

const AuthInput = ({
    placeholder,
    value,
    keyboardType = "default",
    autoCapitalize = "none",
    returnKeyType = "done",
    onChange,
    onSubmitEditing = () => null,
    autoCorrect = true,
    secureTextEntry = false
}) => (
    <Container>
        <TextInput
            onChangeText={onChange}
            keyboardType={keyboardType}
            returnKeyType={returnKeyType}
            placeholder={placeholder}
            autoCapitalize={autoCapitalize}
            onSubmitEditing={onSubmitEditing}
            autoCorrect={autoCorrect}
            value={value}
            secureTextEntry={secureTextEntry}
        />
    </Container>
);

AuthInput.propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    keyboardType: PropTypes.oneOf([
        "default",
        "number-pad",
        "decimal-pad",
        "numeric",
        "email-address",
        "phone-pad"
    ]),
    autoCapitalize: PropTypes.oneOf(["none", "sentences", "words", "characters"]),
    onChange: PropTypes.func.isRequired,
    returnKeyType: PropTypes.oneOf(["done", "go", "next", "search", "send"]),
    onSubmitEditing: PropTypes.func,
    autoCorrect: PropTypes.bool,
    secureTextEntry: PropTypes.bool
};

export default AuthInput;