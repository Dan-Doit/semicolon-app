import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from 'react-apollo-hooks';
import { CONFIRM_SECRET } from "./AuthQueries";


const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({ navigation }) => {
    const confirmInput = useInput("");
    const [loading, setLoading] = useState(false);
    const [confirmSecretMutation] = useMutation(CONFIRM_SECRET, {
        variables: {
            secret: confirmInput.value,
            email: navigation.getParam("email")
        }
    });
    const handleConfirm = async () => {
        const { value } = confirmInput;
        if (value === "" || !value.includes(" ")) {
            return Alert.alert("제대로 입력해주세요!");
        }
        try {
            setLoading(true);
            const {
                data: { confirmSecret }
            } = await confirmSecretMutation();
            if (confirmSecret !== "" || confirmSecret !== false) {
                navigation.navigate("UpdatePw", { email: navigation.getParam("email") });
            } else {
                Alert.alert("시크릿 코드가 틀렸어요..");
            }
        } catch (e) {
            console.log(e);
            Alert.alert("지금은 시도할 수 없어요.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <AuthInput
                    {...confirmInput}
                    placeholder="Secret"
                    returnKeyType="send"
                    onSubmitEditing={handleConfirm}
                    autoCorrect={false}
                />
                <AuthButton loading={loading} onPress={handleConfirm} text="확인하세요 확마" />
            </View>
        </TouchableWithoutFeedback>
    );
};