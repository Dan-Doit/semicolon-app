import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import AuthButton from "../../components/AuthButton";
import AuthInput from "../../components/AuthInput";
import useInput from "../../hooks/useInput";
import { Alert } from "react-native";
import { useMutation } from 'react-apollo-hooks';
import { FIND_PW } from './AuthQueries';

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export default ({ navigation }) => {
    const emailInput = useInput(navigation.getParam("email", ""));
    const [loading, setLoading] = useState(false);
    const [findrequestSecretMutation] = useMutation(FIND_PW, {
        variables: {
            email: emailInput.value
        }

    });
    const handleLogin = async () => {
        const { value } = emailInput;
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value === "") {
            return Alert.alert("이메일을 입력해 주세요!");
        } else if (!emailRegex.test(value)) {
            return Alert.alert("이메일 형식이 아니에요!");
        }
        try {

            setLoading(true);
            const { data: { findrequestSecret } } = await findrequestSecretMutation();

            if (findrequestSecret) {
                Alert.alert("이메일을 확인해주세요");
                navigation.navigate("FindConfirmPw", { email: value });
                return;
            } else {
                Alert.alert("이메일을 확인해주세요");
            }

        } catch (error) {
            console.log(error);
            Alert.alert("로그인 실패", "지금은 로그인할수 없어요 😥");
        } finally {
            setLoading(false);
        }
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
                <AuthInput
                    {...emailInput}
                    placeholder="이메일"
                    keyboardType="email-address"
                    returnKeyType="send"
                    onSubmitEditing={handleLogin}
                    autoCorrect={false}
                />
                <AuthButton loading={loading} onPress={handleLogin} text="이메일 확인" />
            </View>
        </TouchableWithoutFeedback>
    );
};